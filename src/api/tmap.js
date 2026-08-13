import axios from 'axios'

// Tmap Open API 앱키는 .env(VITE_TMAP_APP_KEY)에서만 읽어온다. (하드코딩 금지)
const TMAP_APP_KEY = import.meta.env.VITE_TMAP_APP_KEY
const BASE_URL = 'https://apis.openapi.sk.com/tmap'

// 공통 axios 인스턴스: 매 호출마다 appKey 헤더를 반복 기입하지 않도록 기본값으로 고정
const tmapClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    appKey: TMAP_APP_KEY,
  },
})

/**
 * 출발지/도착지 좌표로 Tmap 자동차 경로를 탐색한다.
 * @param {{ lat: number, lon: number }} start - 출발지 좌표 (위도/경도)
 * @param {{ lat: number, lon: number }} end - 도착지 좌표 (위도/경도)
 * @returns {Promise<import('axios').AxiosResponse>} 경로 데이터 (GeoJSON FeatureCollection)
 */
export function getCarRoute(start, end) {
  return tmapClient.post('/routes?version=1', {
    startX: start.lon,
    startY: start.lat,
    endX: end.lon,
    endY: end.lat,
    reqCoordType: 'WGS84GEO',
    resCoordType: 'WGS84GEO',
    startName: '출발지',
    endName: '도착지',
    searchOption: '0',
  })
}

/**
 * getCarRoute() 응답(GeoJSON FeatureCollection)을 파싱해 전체 도로 경로 좌표와 누적 거리/시간을 계산한다.
 * - 좌표는 LineString Feature에만 들어있다 (Point Feature는 회전 안내용이라 제외).
 * - LineString의 distance(m)/time(초)는 "그 구간 전체"의 값이라, 구간 내부 좌표들은 편의상
 *   구간 시작 시점의 누적값을 공유하고, 구간이 끝난 뒤에 한꺼번에 누적한다.
 * @param {import('axios').AxiosResponse} response - getCarRoute()의 응답
 * @returns {{
 *   totalDistance: number,
 *   totalTime: number,
 *   path: Array<{ lat: number, lon: number, cumulativeDistance: number, cumulativeTime: number }>,
 * }}
 */
export function parseRoutePath(response) {
  const features = response.data?.features ?? []
  const { totalDistance = 0, totalTime = 0 } = features[0]?.properties ?? {}

  const path = []
  let cumulativeDistance = 0
  let cumulativeTime = 0

  features.forEach((feature) => {
    if (feature.geometry?.type !== 'LineString') return

    feature.geometry.coordinates.forEach(([lon, lat]) => {
      // 구간 경계 좌표는 앞 구간의 끝점과 겹치므로(같은 지점) 중복으로 찍지 않는다
      const prev = path[path.length - 1]
      if (prev && prev.lat === lat && prev.lon === lon) return
      path.push({ lat, lon, cumulativeDistance, cumulativeTime })
    })

    const { distance = 0, time = 0 } = feature.properties ?? {}
    cumulativeDistance += distance
    cumulativeTime += time
  })

  return { totalDistance, totalTime, path }
}

/**
 * 좌표를 실제 지명(주소)으로 역변환한다. (리버스지오코딩)
 * 실패하거나 결과가 없으면 null을 반환한다.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string | null>}
 */
export async function reverseGeocode(lat, lon) {
  try {
    const response = await tmapClient.get('/geo/reversegeocoding', {
      params: {
        version: 1,
        lat,
        lon,
        coordType: 'WGS84GEO',
        addressType: 'A10',
      },
    })

    const fullAddress = response.data?.addressInfo?.fullAddress
    if (!fullAddress) return null

    // fullAddress는 "법정동 주소,지번 주소,도로명 주소"가 쉼표로 이어져 있다. 첫 번째(법정동) 주소만 쓴다.
    return fullAddress.split(',')[0]?.trim() || null
  } catch (error) {
    console.error('🔴 리버스지오코딩 실패:', error)
    return null
  }
}

/**
 * 지명/주소 키워드로 Tmap POI를 검색해 대표 좌표로 변환한다. (실제 지오코딩)
 * @param {string} keyword - 예: '서울역', '인천'
 * @returns {Promise<{ name: string, lat: number, lon: number } | null>} 검색 결과가 없으면 null
 */
export async function searchPlace(keyword) {
  const response = await tmapClient.get('/pois', {
    params: {
      version: 1,
      searchKeyword: keyword,
      resCoordType: 'WGS84GEO',
      reqCoordType: 'WGS84GEO',
      count: 1,
    },
  })

  const poi = response.data?.searchPoiInfo?.pois?.poi?.[0]
  if (!poi) return null

  return {
    name: poi.name,
    lat: Number(poi.noorLat),
    lon: Number(poi.noorLon),
  }
}

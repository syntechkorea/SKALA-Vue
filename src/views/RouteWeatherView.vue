<script setup>
import { ref } from 'vue'
import { useRouteStore } from '@/stores/routeStore'
import { getWeatherByCoords } from '@/api/weather'
import { searchPlace, getCarRoute, parseRoutePath, reverseGeocode } from '@/api/tmap'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import RouteSearchForm from '../components/route/RouteSearchForm.vue'
import RouteMap from '../components/route/RouteMap.vue'
import RouteWeatherCard from '../components/route/RouteWeatherCard.vue'
import DestinationWeatherCard from '../components/route/DestinationWeatherCard.vue'
import CargoModeToggle from '../components/route/CargoModeToggle.vue'

const routeStore = useRouteStore()

const originQuery = ref('')
const destinationQuery = ref('')
const isLoading = ref(false)
const selectedCityInfo = ref('출발지/도착지를 입력하고 경로를 검색해 보세요.')

// 경유 체크포인트는 실제 경로 소요시간 기준 약 30분 간격으로 뽑되, 아무리 길어도 최대 4개로 제한한다
const CHECKPOINT_INTERVAL_SECONDS = 30 * 60
const MAX_CHECKPOINTS = 4

// 출발 시각 + 경과(분)으로 통과 예상 시각 문자열(HH:mm) 계산
const calcPassTime = (elapsedMinutes) => {
  const base = routeStore.departureTime ? new Date(routeStore.departureTime) : new Date()
  const passDate = new Date(base.getTime() + elapsedMinutes * 60000)
  const hh = String(passDate.getHours()).padStart(2, '0')
  const mm = String(passDate.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// 리버스지오코딩 주소("경기도 수원시 팔달구 인계동" 등)에서 앞의 두 단어만 추려 짧은 지명으로 만든다
const shortenAddress = (address) => {
  if (!address) return null
  return address.trim().split(/\s+/).slice(0, 2).join(' ')
}

// 도로 경로(path)를 30분 간격 기준으로 훑어, 최대 MAX_CHECKPOINTS개의 체크포인트를 전체 구간에 고르게 뽑는다
const pickCheckpoints = (path, totalTime) => {
  if (path.length === 0 || totalTime <= 0) return []

  const intervalCount = Math.floor(totalTime / CHECKPOINT_INTERVAL_SECONDS)
  const checkpointCount = Math.min(MAX_CHECKPOINTS, Math.max(1, intervalCount))

  const checkpoints = []
  for (let i = 1; i <= checkpointCount; i++) {
    const targetTime = (totalTime * i) / (checkpointCount + 1)
    const point = path.find((p) => p.cumulativeTime >= targetTime)
    if (point) checkpoints.push(point)
  }
  return checkpoints
}

// 경로 검색: 출발지/도착지를 실제 지오코딩 → 실제 도로 경로 탐색 → 경유 체크포인트를 동적으로 뽑아 날씨까지 채운다
const searchRoute = async () => {
  if (!originQuery.value || !destinationQuery.value) {
    selectedCityInfo.value = '출발지와 도착지를 모두 입력해 주세요.'
    return
  }

  isLoading.value = true
  try {
    // 실제 지오코딩: 입력한 지명을 Tmap POI 검색으로 좌표 변환
    const [originPlace, destinationPlace] = await Promise.all([
      searchPlace(originQuery.value),
      searchPlace(destinationQuery.value),
    ])

    if (!originPlace || !destinationPlace) {
      selectedCityInfo.value = '출발지/도착지를 찾을 수 없습니다. 다른 이름으로 검색해 보세요.'
      return
    }

    routeStore.origin = originPlace
    routeStore.destination = destinationPlace

    // 실제 Tmap 경로탐색: 도로를 따라가는 촘촘한 좌표 + 총 소요시간을 얻는다
    const routeRes = await getCarRoute(originPlace, destinationPlace)
    const { path, totalTime } = parseRoutePath(routeRes)
    routeStore.routePath = path.map((p) => ({ lat: p.lat, lon: p.lon }))

    const checkpoints = pickCheckpoints(path, totalTime)

    // 체크포인트별 이름(역지오코딩)·날씨, 도착지 날씨를 한 번에 병렬 조회
    const [checkpointNames, checkpointWeatherResList, destinationRes] = await Promise.all([
      Promise.all(checkpoints.map((cp) => reverseGeocode(cp.lat, cp.lon))),
      Promise.all(checkpoints.map((cp) => getWeatherByCoords(cp.lat, cp.lon))),
      getWeatherByCoords(destinationPlace.lat, destinationPlace.lon),
    ])

    // 지도에 출발→경유→도착 순서로 마커/경로선을 그릴 수 있도록 이름까지 함께 담아둔다
    routeStore.routeCoords = [
      { lat: originPlace.lat, lon: originPlace.lon, name: originPlace.name },
      ...checkpoints.map((cp, idx) => ({
        lat: cp.lat,
        lon: cp.lon,
        name: shortenAddress(checkpointNames[idx]) ?? `경유 지점 ${idx + 1}`,
      })),
      { lat: destinationPlace.lat, lon: destinationPlace.lon, name: destinationPlace.name },
    ]

    routeStore.segmentWeatherList = checkpoints.map((cp, idx) => {
      const raw = checkpointWeatherResList[idx].data
      return {
        id: `checkpoint_${idx}`,
        cityName: shortenAddress(checkpointNames[idx]) ?? `경유 지점 ${idx + 1}`,
        passTime: calcPassTime(cp.cumulativeTime / 60), // cumulativeTime은 초 단위라 분으로 환산
        temp: raw.main.temp,
        status: raw.weather[0].description,
        weatherId: raw.weather?.[0]?.id ?? null,
        windSpeed: raw.wind?.speed ?? 0,
        rainVolume: raw.rain?.['1h'] ?? raw.rain?.['3h'] ?? 0,
      }
    })

    const destRaw = destinationRes.data
    routeStore.destinationWeather = {
      cityName: destinationPlace.name,
      passTime: calcPassTime(totalTime / 60),
      temp: destRaw.main.temp,
      status: destRaw.weather[0].description,
      weatherId: destRaw.weather?.[0]?.id ?? null,
      windSpeed: destRaw.wind?.speed ?? 0,
      rainVolume: destRaw.rain?.['1h'] ?? destRaw.rain?.['3h'] ?? 0,
    }

    selectedCityInfo.value = `${originPlace.name} → ${destinationPlace.name} 경로 날씨 조회 완료`
    console.log('🟢 [API 통신 완료] 경로 구간별 기상 장부 동기화:', routeStore.segmentWeatherList)
  } catch (error) {
    console.error('🔴 경로 날씨 API 연동 실패:', error)
    selectedCityInfo.value = '경로 날씨 조회 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="dashboard-wrapper route-weather-view">
    <BaseDashboardCard class="tmap-card">
      <RouteSearchForm
        :origin-query="originQuery"
        :destination-query="destinationQuery"
        :departure-time="routeStore.departureTime"
        @update-origin="(val) => (originQuery = val)"
        @update-destination="(val) => (destinationQuery = val)"
        @update-departure-time="(val) => (routeStore.departureTime = val)"
        @search="searchRoute"
      />
      <CargoModeToggle style="margin-top: 10px" />
    </BaseDashboardCard>

    <BaseDashboardCard class="tmap-card">
      <h3>🗺️ 경로 지도</h3>
      <RouteMap />
    </BaseDashboardCard>

    <BaseDashboardCard class="tmap-card" v-loading="isLoading">
      <h3>🛣️ 구간별 통과 날씨</h3>

      <template v-if="!isLoading">
        <RouteWeatherCard
          v-for="segment in routeStore.segmentWeatherList"
          :key="segment.id"
          :city-name="segment.cityName"
          :pass-time="segment.passTime"
          :temp="segment.temp"
          :status="segment.status"
          :weather-id="segment.weatherId"
          :wind-speed="segment.windSpeed"
          :rain-volume="segment.rainVolume"
          @select-card="(msg) => (selectedCityInfo = msg)"
        />

        <p
          v-if="routeStore.segmentWeatherList.length === 0"
          style="text-align: center; color: #7f8c8d; padding: 10px 0"
        >
          검색 버튼을 눌러 경로 날씨를 조회해 보세요.
        </p>
      </template>
    </BaseDashboardCard>

    <DestinationWeatherCard
      v-if="routeStore.destinationWeather"
      :city-name="routeStore.destinationWeather.cityName"
      :pass-time="routeStore.destinationWeather.passTime"
      :temp="routeStore.destinationWeather.temp"
      :status="routeStore.destinationWeather.status"
      :weather-id="routeStore.destinationWeather.weatherId"
      :wind-speed="routeStore.destinationWeather.windSpeed"
      :rain-volume="routeStore.destinationWeather.rainVolume"
      @select-card="(msg) => (selectedCityInfo = msg)"
    />

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style>
@import '@/assets/route.css';
</style>

<style scoped>
.status-bar {
  background: var(--tmap-red-soft, #fdecee);
  padding: 10px;
  text-align: center;
  color: var(--tmap-red-dark, #b8152c);
  font-weight: bold;
  border: 1px solid var(--tmap-red, #e71e38);
  border-radius: var(--radius-sm, 8px);
  margin-top: 15px;
}
</style>

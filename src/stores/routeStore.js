import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRouteStore = defineStore('route', () => {
  // 1. state: 출발지 / 도착지 좌표 정보 (예: { name, lat, lon } 형태)
  const origin = ref(null)
  const destination = ref(null)

  // 2. state: 출발 예정 시각
  const departureTime = ref(null)

  // 3. state: 출발+경유 체크포인트+도착 같은 듬성듬성한 지점 목록 (예: [{ lat, lon, name }, ...], 지도 마커용)
  const routeCoords = ref([])

  // 3-1. state: Tmap 실제 경로탐색 결과의 촘촘한 전체 도로 좌표 (예: [{ lat, lon }, ...], 지도 선 그리기용)
  const routePath = ref([])

  // 4. state: 경로를 구간별로 나눠 조회한 날씨 정보 배열
  const segmentWeatherList = ref([])

  // 5. state: 최종 도착지의 날씨 정보
  const destinationWeather = ref(null)

  // 6. state: 화물차 모드 on/off (요금/통행 제한 등 경로 탐색 옵션에 영향)
  const isCargoMode = ref(false)

  // 7. actions: 화물차 모드 토글 (configStore의 toggleUnit과 동일한 패턴)
  function toggleCargoMode() {
    isCargoMode.value = !isCargoMode.value
  }

  return {
    origin,
    destination,
    departureTime,
    routeCoords,
    routePath,
    segmentWeatherList,
    destinationWeather,
    isCargoMode,
    toggleCargoMode,
  }
})

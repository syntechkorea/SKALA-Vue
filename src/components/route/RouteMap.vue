<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouteStore } from '@/stores/routeStore'

// Tmap 지도는 Element Plus 컴포넌트가 아닌 일반 div에 SDK가 직접 그린다.
const mapContainer = ref(null)
const routeStore = useRouteStore()

let mapInstance = null
let markers = []
let polyline = null

const DEFAULT_CENTER = { lat: 37.5665, lon: 126.978 } // 기본 중심: 서울시청

// Tmap SDK는 색상을 JS 문자열로 그리므로 CSS var()를 못 읽는다.
// route.css의 --tmap-red(#e71e38)와 동일 값을 유지하도록 수동 동기화한다.
const TMAP_RED = '#e71e38'

// Tmap SDK는 마커에 기본 아이콘 이미지를 내장하고 있지 않아, 외부 URL 의존 없이 SVG 핀을 직접 만들어 쓴다.
const createPinIcon = (color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="14" r="6" fill="#fff"/>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// 기존에 그려둔 마커/경로선을 지도에서 걷어낸다
const clearOverlays = () => {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
  if (polyline) {
    polyline.setMap(null)
    polyline = null
  }
}

// 마커는 routeStore.routeCoords(출발/경유/도착, 듬성듬성)로 찍고,
// 경로선은 routeStore.routePath(Tmap 실제 경로탐색의 촘촘한 도로 좌표)로 그린 뒤, 전체 경로가 보이도록 지도를 맞춘다
const drawRoute = () => {
  if (!mapInstance) return
  clearOverlays()

  const coords = routeStore.routeCoords
  const path = routeStore.routePath
  if (coords.length === 0 && path.length === 0) return

  const bounds = new window.Tmapv2.LatLngBounds()

  coords.forEach((point, idx) => {
    const position = new window.Tmapv2.LatLng(point.lat, point.lon)
    bounds.extend(position)

    const isOrigin = idx === 0
    const isDestination = idx === coords.length - 1
    const color = isOrigin ? '#2e7d32' : isDestination ? TMAP_RED : '#4b6584'
    const prefix = isOrigin ? '🚩' : isDestination ? '🏁' : '📍'

    markers.push(
      new window.Tmapv2.Marker({
        position,
        icon: createPinIcon(color),
        iconSize: new window.Tmapv2.Size(28, 40),
        title: `${prefix} ${point.name ?? ''}`,
        map: mapInstance,
      }),
    )
  })

  // 실제 도로 경로가 없으면(예: 검색 전) 체크포인트를 직선으로라도 이어서 보여준다
  const linePoints = path.length > 0 ? path : coords
  if (linePoints.length > 0) {
    linePoints.forEach((point) => bounds.extend(new window.Tmapv2.LatLng(point.lat, point.lon)))
    polyline = new window.Tmapv2.Polyline({
      path: linePoints.map((point) => new window.Tmapv2.LatLng(point.lat, point.lon)),
      strokeColor: TMAP_RED,
      strokeWeight: 6,
      map: mapInstance,
    })
  }

  mapInstance.fitBounds(bounds)
}

onMounted(() => {
  // index.html에서 로드한 Tmap JS SDK v2는 전역 window.Tmapv2 객체를 노출한다. (window.Tmap 아님)
  if (!window.Tmapv2) {
    console.error(
      '🔴 Tmap SDK가 로드되지 않았습니다. index.html의 앱키(VITE_TMAP_APP_KEY)를 확인하세요.',
    )
    return
  }

  // Tmap SDK는 width/height를 컨테이너 인라인 style로 그대로 박아버린다.
  // '100%'를 주면 부모에 정해진 높이가 없어 컨테이너가 0에 가깝게 찌부러지므로, 아래 .route-map CSS와 동일한 고정 픽셀값을 준다.
  mapInstance = new window.Tmapv2.Map(mapContainer.value, {
    center: new window.Tmapv2.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lon),
    width: '100%',
    height: '400px',
    zoom: 12,
  })

  drawRoute() // 이미 검색된 경로가 store에 남아있으면 마운트 시점에도 바로 그려준다
})

// 경로 검색 결과(routeCoords/routePath)가 바뀔 때마다 마커/경로선을 다시 그린다
watch(() => routeStore.routeCoords, drawRoute)
watch(() => routeStore.routePath, drawRoute)
</script>

<template>
  <div ref="mapContainer" class="route-map"></div>
</template>

<style scoped>
.route-map {
  width: 100%;
  height: 400px; /* Tmap SDK가 mount 시 이 값을 그대로 inline style로 굽는다. JS의 height:'400px'와 반드시 일치시킬 것 */
  border-radius: 12px;
  border: 1px solid #dee2e6;
  background: #f1f2f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>

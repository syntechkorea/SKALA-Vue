<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useRouteStore } from '@/stores/routeStore'
import { classifyWeatherHazard } from '@/utils/weatherHazard'

// WeatherCard.vue와 달리 cityItem 객체 하나가 아니라 개별 값들을 props로 받는다.
const props = defineProps({
  cityName: {
    type: String,
    required: true,
  },
  passTime: {
    type: String,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  weatherId: {
    type: Number,
    default: null,
  },
  windSpeed: {
    type: Number,
    default: 0,
  },
  rainVolume: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const routeStore = useRouteStore()

// 🔥 WeatherCard.vue의 displayTemp computed와 동일한 화씨 변환 로직을 그대로 재사용
const displayTemp = computed(() => {
  const rawTemp = props.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

// 🚚 [Phase 6] 화물차 위험 판정: 공용 분류 헬퍼로 위임 (눈/폭우/태풍급 강풍/강풍/영하 세분화)
const hazard = computed(() =>
  classifyWeatherHazard({
    id: props.weatherId,
    description: props.status,
    temp: props.temp,
    windSpeed: props.windSpeed,
    rainVolume: props.rainVolume,
  }),
)
</script>

<template>
  <ElCard
    class="weather-card"
    shadow="hover"
    @click="emit('select-card', `${cityName}이 선택되었습니다.`)"
  >
    <h4>{{ cityName }} (통과 예상: {{ passTime }})</h4>
    <p>예상 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <p class="status-text">{{ status }}</p>

    <ElTag v-if="temp >= 25" type="danger" effect="dark">🔥 더움</ElTag>
    <ElTag v-else type="primary" effect="dark">❄️ 선선함</ElTag>

    <!-- 화물차 모드일 때만 위험 구간 배지 노출 (유형별 아이콘/라벨/색상 차등) -->
    <ElTag v-if="routeStore.isCargoMode && hazard.isDangerous" :type="hazard.tagType" effect="dark">
      {{ hazard.icon }} {{ hazard.label }}
    </ElTag>

    <button class="btn-detail" @click.stop="emit('click-detail', cityName, status)">
      상세보기
    </button>
  </ElCard>
</template>

<style scoped>
.weather-card {
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}
.status-text {
  color: var(--text-secondary, #636e72);
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>

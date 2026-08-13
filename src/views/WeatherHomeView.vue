<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getWeatherByCity } from '@/api/weather'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

const weatherList = ref([])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const isLoading = ref(false)
const fetchError = ref(false)

// 3개 도시의 실제 실시간 데이터를 병렬로 긁어오는 비동기 파이프라인 함수
const fetchRealTimeWeather = async () => {
  isLoading.value = true
  fetchError.value = false
  try {
    const [seoulRes, suwonRes, busanRes] = await Promise.all([
      getWeatherByCity('Seoul'),
      getWeatherByCity('Suwon'),
      getWeatherByCity('Busan'),
    ])

    // 기존 자식 컴포넌트(WeatherCard)가 요구하는 프로퍼티 규격에 맞춰 JSON 알맹이 맵핑
    weatherList.value = [
      {
        id: 'city_01',
        name: '서울',
        temp: seoulRes.data.main.temp,
        status: seoulRes.data.weather[0].description,
      },
      {
        id: 'city_02',
        name: '수원',
        temp: suwonRes.data.main.temp,
        status: suwonRes.data.weather[0].description,
      },
      {
        id: 'city_03',
        name: '부산',
        temp: busanRes.data.main.temp,
        status: busanRes.data.weather[0].description,
      },
    ]
    console.log('🟢 [API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화:', weatherList.value)
  } catch (error) {
    console.error('🔴 날씨 API 연동 실패:', error)
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
}

// 초기 마운트 시 주소창의 쿼리(?search=) 스트링 읽어서 상태 복원
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather() // 실시간 데이터 호출
})

// 타이핑될 때마다 주소창의 쿼리 스트링 값을 실시간 푸시 개편
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

// 기존 computed (유지)
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3 class="section-title">🏙️ 지역별 날씨 현황 (실시간 기상청 연동)</h3>

      <ElAlert
        v-if="fetchError && !isLoading"
        type="error"
        show-icon
        :closable="false"
        title="실시간 기상 데이터를 불러오지 못했습니다."
        class="fetch-error"
      >
        <template #default>
          <ElButton size="small" type="danger" plain @click="fetchRealTimeWeather"
            >다시 시도</ElButton
          >
        </template>
      </ElAlert>

      <div
        v-loading="isLoading"
        element-loading-text="🔄 실시간 기상 데이터를 수신 중입니다..."
        style="min-height: 80px"
      >
        <template v-if="!isLoading">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city-item="item"
            @select-card="(msg) => (selectedCityInfo = msg)"
            @click-detail="handleDetailJump(item.id)"
          />

          <ElEmpty
            v-if="filteredWeatherList.length === 0 && !fetchError"
            description="검색 결과와 일치하는 도시가 없습니다."
          />
        </template>
      </div>
    </BaseDashboardCard>
    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

.section-title {
  font-size: 1.05rem;
  color: var(--text-primary, #2c3e50);
  margin-bottom: var(--space-3, 12px);
}

.fetch-error {
  margin-bottom: var(--space-3, 12px);
}

.status-bar {
  background: var(--brand-primary-soft, #e9ecf7);
  padding: 10px;
  text-align: center;
  color: var(--brand-primary-active, #18338c);
  font-weight: bold;
  border-radius: var(--radius-sm, 8px);
}
</style>

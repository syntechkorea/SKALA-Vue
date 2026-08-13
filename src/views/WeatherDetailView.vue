<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { getWeatherByCity } from '@/api/weather'
import { Sunny, Cloudy, Odometer, WindPower, ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const isLoading = ref(false)
const notFound = ref(false)
const fetchError = ref(false)

// 라우터 ID 파라미터를 실제 OpenWeatherMap 쿼리용 영문 명칭과 한글 명칭으로 매핑하는 사전 장부
const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구' },
}

const fetchDetail = async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  notFound.value = false
  fetchError.value = false

  if (!targetCity) {
    notFound.value = true
    return
  }

  isLoading.value = true
  try {
    // 가짜 Mock 객체 대신, 실제 고유 타깃 도시 주소를 정밀 저격 호출
    const response = await getWeatherByCity(targetCity.english)

    const raw = response.data
    // 화면 템플릿 구조가 깨지지 않도록 오픈웨더 JSON 알맹이를 정확히 역매핑 유치
    cityData.value = {
      name: targetCity.korean,
      temp: raw.main.temp, // 섭씨 온도 원본 기록
      status: raw.weather[0].description,
      humidity: `${raw.main.humidity}%`,
      wind: `${raw.wind.speed}m/s`,
    }
  } catch (error) {
    console.error('🔴 상세 정보 로딩 중 네트워크 에러 발생:', error)
    fetchError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDetail)

// 🔥 [핵심 과제] 상세 정보창에서도 화씨 상태일 때 기온을 자동 변환 연산하는 센서 장착
const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.temp // 원본 섭씨 온도
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 공식 적용
  }
  return rawTemp // celsius 상태일 땐 원본 반환
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보 (실시간 데이터 연동)</h3>
    <hr />

    <ElSkeleton :loading="isLoading" animated :rows="5">
      <template #default>
        <div v-if="cityData" class="info-card">
          <h4>📍 지정 지역: {{ cityData.name }}</h4>
          <div class="stat-grid">
            <div class="stat-tile">
              <ElIcon class="stat-icon"><Sunny /></ElIcon>
              <div>
                <p class="stat-label">실시간 기온</p>
                <p class="stat-value">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
              </div>
            </div>
            <div class="stat-tile">
              <ElIcon class="stat-icon"><Cloudy /></ElIcon>
              <div>
                <p class="stat-label">기상 현황</p>
                <p class="stat-value">{{ cityData.status }}</p>
              </div>
            </div>
            <div class="stat-tile">
              <ElIcon class="stat-icon"><Odometer /></ElIcon>
              <div>
                <p class="stat-label">대기 습도</p>
                <p class="stat-value">{{ cityData.humidity }}</p>
              </div>
            </div>
            <div class="stat-tile">
              <ElIcon class="stat-icon"><WindPower /></ElIcon>
              <div>
                <p class="stat-label">현재 풍속</p>
                <p class="stat-value">{{ cityData.wind }}</p>
              </div>
            </div>
          </div>
        </div>

        <ElResult
          v-else-if="notFound"
          icon="warning"
          title="존재하지 않는 지역입니다"
          sub-title="올바른 도시 링크로 다시 시도해 주세요."
        >
          <template #extra>
            <ElButton type="primary" @click="router.push('/')">홈으로</ElButton>
          </template>
        </ElResult>

        <ElAlert
          v-else-if="fetchError"
          type="error"
          show-icon
          :closable="false"
          title="네트워크 오류로 데이터를 불러오지 못했습니다."
        >
          <ElButton size="small" type="danger" plain @click="fetchDetail">다시 시도</ElButton>
        </ElAlert>
      </template>
    </ElSkeleton>

    <ElButton class="back-btn" @click="router.push('/')">
      <ElIcon><ArrowLeft /></ElIcon>
      메인 대시보드로 돌아가기
    </ElButton>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: var(--surface-card, white);
  padding: 20px;
  border-radius: var(--radius-md, 12px);
  box-shadow: var(--shadow-resting, 0 2px 8px rgba(0, 0, 0, 0.06));
}
.info-card {
  padding: 15px 0;
  margin: 15px 0;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4, 16px);
  margin-top: var(--space-4, 16px);
}
@media (max-width: 480px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
.stat-tile {
  display: flex;
  align-items: center;
  gap: var(--space-3, 12px);
  background: var(--surface-muted, #f8f9fa);
  border-radius: var(--radius-sm, 8px);
  padding: var(--space-4, 16px);
}
.stat-icon {
  font-size: 22px;
  color: var(--brand-primary, #1e40af);
}
.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #64748b);
}
.stat-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary, #2c3e50);
}
.back-btn {
  margin-top: var(--space-4, 16px);
}
</style>

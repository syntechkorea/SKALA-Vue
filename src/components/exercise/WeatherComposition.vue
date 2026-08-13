<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 가상의 백엔드 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 21, status: '흐림' },
  { id: 'city_05', name: '대구', temp: 31, status: '맑음' },
  { id: 'city_06', name: '제주', temp: 19, status: '비' },
])

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// computed를 활용한 실시간 검색 필터링 연산기
const filteredWeatherList = computed(() => {
  // 사용자가 입력한 검색어의 앞뒤 공백을 제거합니다.
  const query = searchQuery.value.trim()

  // 검색어가 비어있다면 원본 weatherList를 그대로 보여줍니다.
  if (!query) {
    return weatherList.value
  }

  // 검색어가 포함된 도시만 칼같이 필터링하여 실시간으로 뱉어냅니다.
  return weatherList.value.filter((item) => item.name.includes(query))
})

const statusOptions = ['전체', '맑음', '비', '구름', '흐림']
const selectedStatus = ref('전체')

const visibleWeatherList = computed(() => {
  if (selectedStatus.value === '전체') {
    return filteredWeatherList.value
  }
  return filteredWeatherList.value.filter((item) => item.status === selectedStatus.value)
})

const hottestCity = computed(() =>
  weatherList.value.reduce(
    (max, item) => (item.temp > max.temp ? item : max),
    weatherList.value[0],
  ),
)
const coldestCity = computed(() =>
  weatherList.value.reduce(
    (min, item) => (item.temp < min.temp ? item : min),
    weatherList.value[0],
  ),
)

// watch를 활용한 선택 도시 추적 센서
// selectedCityInfo의 문구 변화를 감시하여 후속 로그를 처리합니다.
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트 되었습니다. -> "${newInfo}"`)
})

// watchEffect를 활용한 자동 의존성 API 로그 시뮬레이션
// 타이핑할 때마다 변하는 searchQuery를 AI CCTV처럼 자동 추적합니다
watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

// 6. [내 연습] 평균 기온 계산 & 고온 경보 시스템
// 사용자가 조절하는 경보 기준 온도 (나만의 반응형 상태 변수)
const alertTemp = ref(27)

// weatherList 전체의 평균 기온을 구하는 파생값 (나만의 computed)
// filteredWeatherList와 똑같이, weatherList가 바뀌면 자동으로 다시 계산됩니다.
const averageTemp = computed(() => {
  let total = 0
  for (const item of weatherList.value) {
    total += item.temp
  }
  return total / weatherList.value.length
})

// 경보 기준(alertTemp)이 바뀔 때마다 평균 기온과 비교해 감시하는 나만의 watcher
watch(alertTemp, (newThreshold) => {
  if (averageTemp.value >= newThreshold) {
    console.warn(
      `[watch 경보] 평균 기온(${averageTemp.value}°C)이 기준(${newThreshold}°C)을 넘었습니다!`,
    )
  } else {
    console.log(`[watch] 경보 기준이 ${newThreshold}°C 로 조정되었습니다. (현재 평균 이하)`)
  }
})

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
      <div class="status-filter">
        <button
          v-for="status in statusOptions"
          :key="status"
          type="button"
          class="status-chip"
          :class="{ active: selectedStatus === status }"
          @click="selectedStatus = status"
        >
          {{ status }}
        </button>
      </div>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>
      <!-- ① v-for 의 대상을 weatherList → filteredWeatherList 로 교체-->
      <div
        v-for="item in visibleWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 28" class="badge hot">🔥 더움 (28도 이상)</span>
        <span v-else-if="item.temp >= 22" class="badge mild">🌤️ 보통 (22~27도)</span>
        <span v-else class="badge cool">❄️ 선선함 (22도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
      <p
        v-if="visibleWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        ❌ 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <section class="alert-box extreme-box">
      <h3>📊 오늘의 최고 &amp; 최저</h3>
      <p>
        최고 기온: <strong>{{ hottestCity.name }} ({{ hottestCity.temp }}°C)</strong>
      </p>
      <p>
        최저 기온: <strong>{{ coldestCity.name }} ({{ coldestCity.temp }}°C)</strong>
      </p>
    </section>

    <!-- ★ [내 연습] 평균 기온 & 고온 경보 -->
    <section class="alert-box">
      <h3>🌡️ 평균 기온 &amp; 고온 경보</h3>
      <p>
        전체 도시 평균 기온: <strong>{{ averageTemp.toFixed(1) }}°C</strong>
      </p>
      <label>
        경보 기준 온도:
        <input type="number" :value="alertTemp" @input="(e) => (alertTemp = e.target.value)" />°C
      </label>
      <p v-if="averageTemp >= alertTemp" class="alert-warning">
        🚨 평균 기온이 경보 기준을 초과했습니다!
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

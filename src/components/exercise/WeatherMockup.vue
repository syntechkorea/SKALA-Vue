<script setup>
import { ref } from 'vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
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

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const sortDesc = ref(true)
const toggleSort = () => {
  sortDesc.value = !sortDesc.value
  weatherList.value = [...weatherList.value].sort((a, b) =>
    sortDesc.value ? b.temp - a.temp : a.temp - b.temp,
  )
}

const favoriteIds = ref([])
const toggleFavorite = (id) => {
  if (favoriteIds.value.includes(id)) {
    favoriteIds.value = favoriteIds.value.filter((fid) => fid !== id)
  } else {
    favoriteIds.value = [...favoriteIds.value, id]
  }
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
    </section>

    <section class="list-box">
      <div class="list-box-header">
        <h3>🏙️ 지역별 날씨 현황</h3>
        <button type="button" class="btn-sort" @click="toggleSort">
          {{ sortDesc ? '기온 높은순 ▼' : '기온 낮은순 ▲' }}
        </button>
      </div>

      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        :class="{ favorite: favoriteIds.includes(item.id) }"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <div class="weather-card-title">
          <button type="button" class="btn-favorite" @click.stop="toggleFavorite(item.id)">
            {{ favoriteIds.includes(item.id) ? '★' : '☆' }}
          </button>
          <h4>{{ item.name }} ({{ item.status }})</h4>
        </div>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 28" class="badge hot">🔥 더움 (28도 이상)</span>
        <span v-else-if="item.temp >= 22" class="badge mild">🌤️ 보통 (22~27도)</span>
        <span v-else class="badge cool">❄️ 선선함 (22도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

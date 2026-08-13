<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-container">
    <ElResult>
      <template #icon>
        <div class="error-icon">☀️❓</div>
      </template>
      <template #title>페이지를 찾을 수 없습니다</template>
      <template #sub-title>요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</template>
      <template #extra>
        <ElButton type="primary" @click="goHome">날씨 메인으로 이동</ElButton>
      </template>
    </ElResult>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-icon {
  font-size: 3.5rem;
  line-height: 1;
}
</style>

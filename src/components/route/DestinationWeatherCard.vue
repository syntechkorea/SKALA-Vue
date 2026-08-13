<script setup>
import BaseDashboardCard from '../exercise/BaseDashboardCard.vue'
import RouteWeatherCard from './RouteWeatherCard.vue'

// RouteWeatherCard와 동일한 규격을 그대로 받아 전달한다.
defineProps({
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
</script>

<template>
  <BaseDashboardCard class="destination-weather-wrapper tmap-card">
    <h3>🏁 도착지 날씨</h3>
    <RouteWeatherCard
      :city-name="cityName"
      :pass-time="passTime"
      :temp="temp"
      :status="status"
      :weather-id="weatherId"
      :wind-speed="windSpeed"
      :rain-volume="rainVolume"
      @select-card="(msg) => emit('select-card', msg)"
      @click-detail="(name, status) => emit('click-detail', name, status)"
    />
  </BaseDashboardCard>
</template>

<style scoped>
.destination-weather-wrapper :deep(.weather-card) {
  margin-bottom: 0;
}
</style>

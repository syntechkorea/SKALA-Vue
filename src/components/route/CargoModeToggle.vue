<script setup>
import { useRouteStore } from '@/stores/routeStore'
const routeStore = useRouteStore()
</script>

<template>
  <div
    style="
      text-align: center;
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    "
  >
    <span
      >화물차 모드: <strong>{{ routeStore.isCargoMode ? 'ON' : 'OFF' }}</strong></span
    >
    <ElSwitch
      :model-value="routeStore.isCargoMode"
      active-text="🚚 ON"
      inactive-text="OFF"
      inline-prompt
      @change="routeStore.toggleCargoMode"
    />
  </div>
</template>

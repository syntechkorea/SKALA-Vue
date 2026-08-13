<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()

// ElSwitch는 boolean 기반이므로 store의 'celsius'/'fahrenheit' 문자열을 boolean으로 매핑
const isFahrenheit = computed(() => configStore.unit === 'fahrenheit')
</script>

<template>
  <div class="unit-toggler-pill">
    <span
      >날씨단위: <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong></span
    >
    <ElSwitch
      :model-value="isFahrenheit"
      active-text="℉"
      inactive-text="℃"
      inline-prompt
      @change="configStore.toggleUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2, 8px);
  background: var(--surface-muted, #f8f9fa);
  border: 1px solid var(--border-subtle, #e9ecef);
  border-radius: var(--radius-pill, 999px);
  padding: var(--space-2, 8px) var(--space-4, 16px);
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
}
</style>

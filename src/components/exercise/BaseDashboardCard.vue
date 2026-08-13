<template>
  <ElCard shadow="never" class="base-dashboard-card" :body-style="{ padding: '15px' }">
    <slot></slot>
  </ElCard>
</template>

<style scoped>
.base-dashboard-card {
  margin-bottom: 15px;
  background: var(--surface-muted, #f8f9fa);
  border-color: var(--border-subtle, #e9ecef);
  border-radius: var(--radius-md, 12px);
  box-shadow: var(--shadow-resting, 0 2px 8px rgba(15, 23, 42, 0.06));
}
</style>

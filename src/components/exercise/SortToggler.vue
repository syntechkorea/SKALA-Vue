<script setup>
defineProps({
  order: {
    type: String,
    default: 'desc',
  },
})
defineEmits(['toggle-order'])
</script>

<template>
  <div class="sort-toggler">
    <span class="sort-label">정렬</span>
    <ElButton
      size="small"
      :type="order === 'desc' ? 'primary' : 'default'"
      @click="$emit('toggle-order')"
    >
      {{ order === 'desc' ? '기온 높은순' : '기온 낮은순' }}
    </ElButton>
  </div>
</template>

<style scoped>
.sort-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sort-label {
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
}
</style>

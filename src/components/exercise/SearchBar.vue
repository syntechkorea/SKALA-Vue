<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <h3>🔎 도시 검색</h3>
    <ElInput
      :model-value="currentQuery"
      placeholder="검색할 도시 이름 입력"
      clearable
      @input="$emit('update-query', $event)"
      @clear="$emit('update-query', '')"
    />
    <p class="search-status">
      검색 중인 도시 : <strong>{{ currentQuery || '전체' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner h3 {
  font-size: 1.05rem;
  color: var(--text-primary, #2c3e50);
  margin-bottom: var(--space-2, 8px);
}
.search-status {
  margin-top: var(--space-2, 8px);
  color: var(--text-secondary, #64748b);
  font-size: 0.9rem;
}
.search-status strong {
  color: var(--text-primary, #2c3e50);
}
</style>

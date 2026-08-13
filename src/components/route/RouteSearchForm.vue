<script setup>
import { LocationFilled, Flag } from '@element-plus/icons-vue'

// SearchBar.vue와 동일한 패턴: 상위로부터 현재 값을 props로 받고, 변경/검색 시 이벤트로 상위에 알린다.
defineProps({
  originQuery: {
    type: String,
    default: '',
  },
  destinationQuery: {
    type: String,
    default: '',
  },
  departureTime: {
    type: [String, Date, null],
    default: null,
  },
})

defineEmits(['update-origin', 'update-destination', 'update-departure-time', 'search'])
</script>

<template>
  <div class="route-search-form">
    <h3>🚚 경로 검색</h3>
    <ElInput
      :model-value="originQuery"
      placeholder="출발지 입력"
      clearable
      :prefix-icon="LocationFilled"
      @input="$emit('update-origin', $event)"
      @clear="$emit('update-origin', '')"
    />
    <ElInput
      :model-value="destinationQuery"
      placeholder="도착지 입력"
      clearable
      :prefix-icon="Flag"
      @input="$emit('update-destination', $event)"
      @clear="$emit('update-destination', '')"
    />
    <ElDatePicker
      :model-value="departureTime"
      type="datetime"
      placeholder="출발 시각 선택"
      style="width: 100%"
      @update:model-value="$emit('update-departure-time', $event)"
    />
    <ElButton type="primary" class="tmap-btn" @click="$emit('search')">경로 검색</ElButton>
  </div>
</template>

<style scoped>
.route-search-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Tmap 레드 액센트: 이 버튼 하나만 오버라이드, 전역 --el-color-primary는 건드리지 않는다 */
.tmap-btn {
  --el-button-bg-color: var(--tmap-red, #e71e38);
  --el-button-border-color: var(--tmap-red, #e71e38);
  --el-button-hover-bg-color: var(--tmap-red-dark, #b8152c);
  --el-button-hover-border-color: var(--tmap-red-dark, #b8152c);
}

/* Tmap 검색창 느낌으로 입력창 라운드 처리 (내부 요소이므로 :deep 필요) */
.route-search-form :deep(.el-input__wrapper) {
  border-radius: 20px;
}
</style>

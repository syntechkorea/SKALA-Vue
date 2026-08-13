<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
// 원본 소스는 defineProps({...}) 로만 되어 있어 props 변수가 없다.
// 아래 displayTemp 에서 props.cityItem 을 읽어야 하므로 반환값을 변수에 담는다.
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const configStore = useConfigStore()
// 🔥 [핵심 미션] 스토어의 상태값이 'fahrenheit'일 때만 화씨 공식 적용 연산
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})
</script>

<template>
  <ElCard
    class="weather-card"
    shadow="hover"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <div class="weather-card-title">
      <button type="button" class="btn-favorite" @click.stop="emit('toggle-favorite', cityItem.id)">
        {{ isFavorite ? '★' : '☆' }}
      </button>
      <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    </div>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <ElTag v-if="cityItem.temp >= 25" type="danger" effect="dark">🔥 더움</ElTag>
    <ElTag v-else type="primary" effect="dark">❄️ 선선함</ElTag>

    <ElButton
      class="btn-detail"
      size="small"
      type="primary"
      plain
      @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
    >
      상세보기
    </ElButton>
  </ElCard>
</template>

<style scoped>
.weather-card {
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}
.weather-card-title {
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-favorite {
  background: none;
  border: none;
  padding: 0;
  font-size: 18px;
  line-height: 1;
  color: #f4a261;
  cursor: pointer;
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 12px;
}
</style>

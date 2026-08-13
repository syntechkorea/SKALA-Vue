<script setup>
import { ref, watch } from 'vue'
const currentCity = ref('서울')
const logMessage = ref('감시 시스템 작동 전')

//currentCity 변수를 감시하는 watcher를 등록한다.
watch(currentCity, (newValue, oldValue) => {
  logMessage.value = `감시자 발동, [${oldValue}]에서 [${newValue}] 로 변경됨.`
  console.log(`[서버 요청 완료] 기상청 서버에서 ${newValue}의 날씨 API를 다시 조회합니다..`)
})
</script>

<template>
  <div class="practice-section">
    <h2>감시자 watch()의 원리와 실무 활용</h2>
    <h3>지역 선택 제어판</h3>
    <p>현재 선택된 도시 : {{ currentCity }}</p>
    <button @click="currentCity = '서울'">서울 선택</button> &nbsp;
    <button @click="currentCity = '부산'">부산 선택</button> &nbsp;
    <button @click="currentCity = '대구'">대구 선택</button> &nbsp;
    <button @click="currentCity = '광주'">광주 선택</button>
    <div class="monitor">
      <h3>Watcher 모니터링 시스템</h3>
      <p>{{ logMessage }}</p>
      <small style="color: gray">(버튼을 누른 후 브라우저 콘솔창 F12를 확인해 보세요)</small>
    </div>
  </div>
</template>

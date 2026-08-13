<script setup>
import PracticeApp from './PracticeApp.vue'
import ExerciseApp from './ExerciseApp.vue'

// 이 한 줄만 바꾸면 화면이 전환된다.
// 'practice' = 강의 예제 보기
// 'exercise' = 과제 보기
// ⚠️ 과제 제출 시에는 반드시 'exercise' 여야 한다.
const MODE = 'exercise'
</script>

<template>
  <!--
    v-if 는 조건이 거짓이면 DOM 에 아예 만들지 않는다.
    과제 모드일 때 강의 예제 컴포넌트는 실행조차 되지 않으므로
    예제 쪽 에러가 과제 화면에 영향을 주지 않는다.
  -->
  <PracticeApp v-if="MODE === 'practice'" />
  <ExerciseApp v-else />
</template>

import './assets/main.css'
import 'element-plus/dist/index.css'
import './assets/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  ElButton,
  ElSwitch,
  ElInput,
  ElCard,
  ElTag,
  ElSkeleton,
  ElSkeletonItem,
  ElDatePicker,
  ElIcon,
  ElEmpty,
  ElAlert,
  ElResult,
  ElLoadingDirective,
} from 'element-plus'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Element Plus: 전체 플러그인이 아닌 실제 사용하는 컴포넌트만 개별 등록
app.component('ElButton', ElButton)
app.component('ElSwitch', ElSwitch)
app.component('ElInput', ElInput)
app.component('ElCard', ElCard)
app.component('ElTag', ElTag)
app.component('ElSkeleton', ElSkeleton)
app.component('ElSkeletonItem', ElSkeletonItem)
app.component('ElDatePicker', ElDatePicker)
app.component('ElIcon', ElIcon)
app.component('ElEmpty', ElEmpty)
app.component('ElAlert', ElAlert)
app.component('ElResult', ElResult)
app.directive('loading', ElLoadingDirective)

app.mount('#app')

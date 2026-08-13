<script setup>
import { ref } from 'vue'
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'

const TABS = [
  { key: 'ex1', label: '과제1' },
  { key: 'ex2', label: '과제2' },
  { key: 'ex3', label: '과제3' },
  { key: 'final', label: '최종' },
]
const activeTab = ref('ex1')
</script>

<template>
  <div class="exercise-app">
    <nav class="navigation-bar top-navigation-bar">
      <template v-for="(tab, idx) in TABS" :key="tab.key">
        <button
          type="button"
          class="nav-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
        <span v-if="idx < TABS.length - 1" class="divider">|</span>
      </template>
    </nav>

    <div v-if="activeTab === 'ex1'" class="app-container">
      <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
      <hr />
      <WeatherMockup />
    </div>

    <div v-if="activeTab === 'ex2'" class="app-container">
      <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
      <hr />
      <WeatherComposition />
    </div>

    <div v-if="activeTab === 'ex3'" class="app-container">
      <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
      <hr />
      <WeatherParent />
    </div>

    <div v-if="activeTab === 'final'" class="app-container app-final">
      <h1>⛅ 최종: Axios 적용</h1>
      <hr />
      <header class="app-header">
        <RouterLink to="/" class="app-brand">☁️ WeatherOps</RouterLink>
        <nav class="app-nav">
          <RouterLink to="/" class="app-nav-link">🌦️ 날씨 대시보드</RouterLink>
          <RouterLink to="/about" class="app-nav-link">ℹ️ 서비스 소개</RouterLink>
          <RouterLink to="/route" class="app-nav-link">🚚 경로 날씨</RouterLink>
        </nav>
        <div class="app-nav-actions">
          <UnitToggler />
        </div>
      </header>
      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>

<style scoped>
.app-final {
  --el-color-primary: var(--brand-primary);
  --el-color-primary-light-3: var(--brand-primary-hover);
  --el-color-primary-light-5: #8fa0d7;
  --el-color-primary-light-7: #bcc6e7;
  --el-color-primary-light-8: #d2d9ef;
  --el-color-primary-light-9: var(--brand-primary-soft);
  --el-color-primary-dark-2: var(--brand-primary-active);
}

.app-header {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-resting);
  margin-bottom: var(--space-4);
}

.app-brand {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.app-nav {
  display: flex;
  gap: var(--space-5);
  margin-right: auto;
}

.app-nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.app-nav-link:hover {
  color: var(--brand-primary);
}

.app-nav-link.router-link-exact-active {
  color: var(--brand-primary);
  border-bottom-color: var(--brand-primary);
}

.app-nav-actions {
  padding-left: var(--space-4);
  border-left: 1px solid var(--border-subtle);
}
</style>

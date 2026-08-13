<script setup>
import { useRouter } from 'vue-router'
import { Sunny, Cloudy, LocationFilled, Switch } from '@element-plus/icons-vue'

const router = useRouter()
const handleGoHome = () => {
  router.push('/')
}

const features = [
  {
    icon: Sunny,
    title: '실시간 날씨 대시보드',
    desc: '기상청(OpenWeatherMap) API와 연동해 주요 도시의 실시간 기온·상태를 한눈에 보여줍니다.',
  },
  {
    icon: Cloudy,
    title: '상세 관측 정보',
    desc: '도시별 기온·습도·풍속 등 상세 관측 데이터를 스탯 카드 형태로 제공합니다.',
  },
  {
    icon: LocationFilled,
    title: 'Tmap 경로 날씨 · 화물차 위험 알림',
    desc: 'Tmap 실제 도로 경로를 따라 구간별 날씨를 조회하고, 폭우·폭설·태풍급 강풍 등 화물차 운행 위험을 실시간으로 판정해 알려줍니다.',
  },
  {
    icon: Switch,
    title: '섭씨 / 화씨 단위 전환',
    desc: '상단 네비게이션의 단위 토글로 모든 화면의 기온 표기를 즉시 전환할 수 있습니다.',
  },
]

const techStack = [
  'Vue 3 (Composition API)',
  'Pinia',
  'Axios',
  'OpenWeatherMap',
  'Tmap API',
  'Element Plus',
]
</script>

<template>
  <div class="about-page">
    <section class="hero">
      <h1>실시간 날씨, 이제 경로까지</h1>
      <p class="hero-subtitle">
        WeatherOps는 실시간 기상 데이터와 Tmap 경로 탐색을 결합해, 이동 중에도 안전한 의사결정을
        돕는 날씨 대시보드입니다.
      </p>
    </section>

    <section class="feature-grid">
      <article v-for="feature in features" :key="feature.title" class="feature-card">
        <ElIcon class="feature-icon" :size="22"><component :is="feature.icon" /></ElIcon>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </article>
    </section>

    <section class="tech-stack">
      <span class="tech-stack-label">기술 스택</span>
      <span class="tech-stack-list">{{ techStack.join(' · ') }}</span>
    </section>

    <ElButton type="primary" class="cta-button" @click="handleGoHome">대시보드로 이동</ElButton>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6, 32px);
}

.hero h1 {
  font-size: 1.6rem;
  color: var(--text-primary, #2c3e50);
  margin-bottom: var(--space-2, 8px);
}

.hero-subtitle {
  color: var(--text-secondary, #64748b);
  line-height: 1.6;
  max-width: 560px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4, 16px);
}

@media (max-width: 560px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: var(--surface-muted, #f8f9fa);
  border: 1px solid var(--border-subtle, #e9ecef);
  border-radius: var(--radius-md, 12px);
  padding: var(--space-4, 16px);
}

.feature-icon {
  color: var(--brand-primary, #1e40af);
  background: var(--brand-primary-soft, #e9ecf7);
  border-radius: var(--radius-sm, 8px);
  padding: var(--space-2, 8px);
  margin-bottom: var(--space-2, 8px);
}

.feature-card h3 {
  font-size: 0.98rem;
  color: var(--text-primary, #2c3e50);
  margin-bottom: var(--space-1, 4px);
}

.feature-card p {
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
  line-height: 1.5;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2, 8px);
  padding: var(--space-3, 12px) var(--space-4, 16px);
  background: var(--surface-page, #f5f7fa);
  border-radius: var(--radius-sm, 8px);
  font-size: 0.85rem;
}

.tech-stack-label {
  font-weight: 700;
  color: var(--text-primary, #2c3e50);
}

.tech-stack-list {
  color: var(--text-secondary, #64748b);
}

.cta-button {
  align-self: flex-start;
}
</style>

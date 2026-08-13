# 🌦️ skala-vue — 날씨 대시보드 &amp; 경로 날씨 알리미

SK AX Full-Stack Engineering (Frontend: Vue.js) 종합실습 과제입니다. 4일간 Vue 3 문법 → Composition API → 컴포넌트 분리 → Router/Pinia/Axios → 빌드/배포 순서로 진행했고, 9개 과제 범위를 넘어 **Tmap Open API 기반 경로 날씨 알리미**를 추가로 구현했습니다.

## 배포 주소

- <https://syntechkorea.github.io/SKALA-Vue/>

## 기술 스택

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia (setup store 방식)
- **HTTP Client**: Axios (`axios.create()` 기반 API 클라이언트 분리)
- **UI Library**: Element Plus
- **외부 API**: OpenWeatherMap API, Tmap Open API (POI 검색 · 경로탐색 · 리버스지오코딩)
- **코드 품질**: ESLint (flat config) + Oxlint, Prettier

## 실행 방법

```bash
# 1. 설치
npm install

# 2. 환경 변수 설정 — 프로젝트 루트에 .env.local 생성
echo "VITE_WEATHER_API_KEY=발급받은_OpenWeatherMap_키" >> .env.local
echo "VITE_TMAP_APP_KEY=발급받은_Tmap_앱키" >> .env.local

# 3. 개발 서버 실행
npm run dev        # http://localhost:3000

# 4. 빌드
npm run build       # dist/ 생성

# 5. 코드 품질 검사
npm run lint         # oxlint → eslint (--fix 포함), error 0건이 목표
npm run format       # prettier

# 6. GitHub Pages 배포
npm run deploy       # 빌드 + gh-pages 브랜치 푸시
```

`.env.local`은 Git에 올라가지 않습니다(`.gitignore`). API 키는 각자 발급받은 값을 사용해야 합니다.

- OpenWeatherMap: <https://openweathermap.org> (My API keys 탭)
- Tmap Open API: <https://tmapapi.sktelecom.com>

## 폴더 구조

```
src/
├── App.vue                    # practice/exercise 모드 스위치 (MODE = 'exercise')
├── PracticeApp.vue            # 수업 시간 예제 모음 (채점 대상 아님)
├── ExerciseApp.vue            # 과제 화면 — 상단 탭(과제1/과제2/과제3/최종)으로 전환
│
├── router/index.js            # Vue Router 설정 — Home/About/Detail/RouteWeather/NotFound
├── stores/
│   ├── configStore.js         # 온도 단위(섭씨/화씨) 전역 상태 (Pinia)
│   └── routeStore.js          # 경로 날씨 알리미 상태 (Pinia)
├── api/
│   ├── weather.js             # OpenWeatherMap 클라이언트 (axios.create)
│   └── tmap.js                # Tmap Open API 클라이언트 (axios.create)
├── utils/
│   └── weatherHazard.js       # 화물차 위험 기상 판정 로직 (태풍/폭우/폭설/강풍/결빙)
│
├── components/
│   ├── exercise/               # 과제 ①~⑥ 컴포넌트
│   │   ├── WeatherMockup.vue       # 과제① — v-for/v-if/한글입력/이벤트
│   │   ├── WeatherComposition.vue  # 과제② — computed/watch/watchEffect
│   │   ├── WeatherParent.vue       # 과제③ — 부모 (데이터/로직 보유)
│   │   ├── BaseDashboardCard.vue   # 과제③ — slot 껍데기
│   │   ├── SearchBar.vue           # 과제③ — props/emits
│   │   ├── WeatherCard.vue         # 과제③,⑤ — props/emits, 온도 단위 변환
│   │   └── UnitToggler.vue         # 과제⑤ — Pinia 액션 호출
│   ├── route/                  # 경로 날씨 알리미 (확장 기능)
│   │   ├── RouteSearchForm.vue
│   │   ├── RouteMap.vue
│   │   ├── RouteWeatherCard.vue
│   │   ├── DestinationWeatherCard.vue
│   │   └── CargoModeToggle.vue
│   └── practices/               # 수업 예제 (basic·component·composition)
│
└── views/
    ├── WeatherHomeView.vue     # 과제④,⑥ — 라우터 메인 + Axios 실시간 연동
    ├── WeatherDetailView.vue   # 과제④,⑤,⑥ — 상세 페이지
    ├── WeatherAboutView.vue    # 과제④ — 서비스 소개
    ├── NotFoundView.vue        # 과제④ — Catch-all 404
    └── RouteWeatherView.vue    # 경로 날씨 알리미 메인 화면 (확장 기능)
```

## 과제별 구현 내용

| 과제 | 일차    | 요구사항        | 구현 위치                                                                    | 핵심 문법                                                                                                       |
| ---- | ------- | --------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ①    | 1일차   | 날씨 Mockup     | `WeatherMockup.vue`                                                          | `v-for`+`:key`, `v-if`/`v-else`, `:value`+`@input`(한글 IME), `@click`/`@click.stop`                            |
| ②    | 2-1일차 | 날씨 (컴포지션) | `WeatherComposition.vue`                                                     | `computed`(검색 필터링), `watch`(선택 상태 감시), `watchEffect`(검색어 자동 추적)                               |
| ③    | 2-2일차 | 날씨 (컴포넌트) | `WeatherParent.vue` 외 3종                                                   | `props`/`emits`, `<slot>`, `<style scoped>`                                                                     |
| ④    | 3-1일차 | Vue Router      | `router/index.js`, `views/*`                                                 | 동적 세그먼트(`:cityId`), 쿼리 스트링(`?search=`), `RouterLink`/`RouterView`, `useRouter`/`useRoute`, 지연 로딩 |
| ⑤    | 3-2일차 | Pinia           | `stores/configStore.js`, `UnitToggler.vue`                                   | setup store(`state`/`getters`/`actions`), 여러 컴포넌트 간 전역 상태 공유                                       |
| ⑥    | 3-3일차 | Axios           | `views/WeatherHomeView.vue`, `views/WeatherDetailView.vue`, `api/weather.js` | `axios.create()` 인스턴스 분리, `async`/`await`, `Promise.all` 병렬 요청, `try`/`catch`/`finally` 로딩 처리     |
| ⑨    | 4일차   | 빌드·배포       | `eslint.config.js`, `.prettierrc.json`, `vite.config.js`, `.env.local`       | ESLint/Prettier, 환경 변수 분리, `base` 경로, GitHub Pages(`gh-pages`)                                          |

## 추가 구현 — 경로 날씨 알리미 (교과 과정 확장)

9개 과제 범위를 넘어, Tmap Open API와 OpenWeatherMap을 연동해 **출발지 → 도착지 경로 위 주요 지점의 통과 예상 시각과 그 시각의 날씨**를 보여주는 기능을 추가로 구현했습니다 (`/route` 경로).

- **실제 도로 경로**: `searchPlace()`(지명→좌표) → `getCarRoute()`(Tmap 경로탐색) → `parseRoutePath()`로 실제 도로를 따라가는 경로를 지도에 표시
- **구간별 시각 맞춤 날씨**: 경로를 30분 간격으로 훑어 체크포인트를 추출하고, `reverseGeocode()` + `getWeatherByCoords()`를 `Promise.all`로 병렬 조회
- **화물차 위험 배지**: `utils/weatherHazard.js`에서 태풍급 강풍·폭우·폭설·강풍·결빙 5종을 판정해 위험 구간에만 배지 표시 (화물차 모드 토글 시)
- **Axios 인스턴스 분리**: `api/tmap.js`, `api/weather.js`에서 각각 `axios.create()`로 클라이언트를 만들어 `baseURL`/인증 정보를 한 번만 설정하고, 화면 컴포넌트는 API 세부 구현을 몰라도 되도록 관심사를 분리

이해관계자 관점에서는 일반 이용자에게는 경로 중 날씨 급변 구간을 사전에 경고하고, 화물차주에게는 결빙·강풍 등 안전사고로 이어질 수 있는 구간을 배지로 알리는 것을 목표로 했습니다.

## API 검증

브라우저 Network 탭에서 실제 호출된 요청을 curl로 복사해 Postman에 Import하는 방식으로, POI 검색 · 경로탐색 · 리버스지오코딩 · 날씨 조회 4종 API의 실제 응답 구조를 직접 확인했습니다.

## 보안 관련 참고

- API 키는 `.env.local`에만 두고 소스에 하드코딩하지 않았습니다. `import.meta.env.VITE_*`로 읽습니다.
- 다만 프론트엔드 전용 구조에서는 빌드된 JS 파일 안에 키가 문자열로 포함되므로, 브라우저 개발자 도구에서 키 자체는 확인할 수 있습니다. `.env.local`의 목적은 **소스 저장소(Git) 유출 방지**이며, 완전한 키 은닉에는 백엔드 프록시가 필요합니다.

## 이 프로젝트의 한계

- 경로 체크포인트는 실제 경로 기준 최대 4개로 제한
- 위험 판정 임계값은 실제 기상특보 기준이 아닌 교육용 단순화 값
- GitHub Pages는 SPA 라우팅을 지원하지 않아 `/about` 등 하위 경로를 주소창에 직접 입력하면 404가 발생 (메인에서 링크로 이동 시 정상)

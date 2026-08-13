import axios from 'axios'

// OpenWeatherMap API 키는 .env(VITE_WEATHER_API_KEY)에서만 읽어온다. (하드코딩 금지)
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// 공통 axios 인스턴스: 매 호출마다 appid/units/lang을 반복 기입하지 않도록 기본 params로 고정
const weatherClient = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'kr',
  },
})

/**
 * 도시명(영문)으로 OpenWeatherMap 실시간 날씨 데이터를 조회한다.
 * @param {string} cityName - 예: 'Seoul', 'Suwon', 'Busan'
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function getWeatherByCity(cityName) {
  return weatherClient.get('', { params: { q: cityName } })
}

/**
 * 위도/경도 좌표로 OpenWeatherMap 실시간 날씨 데이터를 조회한다. (지오코딩된 임의 지점용)
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function getWeatherByCoords(lat, lon) {
  return weatherClient.get('', { params: { lat, lon } })
}

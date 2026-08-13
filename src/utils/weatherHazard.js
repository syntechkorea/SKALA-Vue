// 화물차 위험 판정 로직: OWM 응답의 실제 필드(weather[0].id, wind.speed, rain 강수량)를 기반으로 위험 유형 분류.

// --- 임계값 상수 ---
const HEAVY_RAIN_IDS = [502, 503, 504, 522] // OWM: heavy/very heavy/extreme rain(5xx), heavy shower rain
const HEAVY_RAIN_VOLUME_MM = 20 // 1시간 강수량 20mm↑ (참고: 기상청 호우주의보는 3시간 60mm/12시간 110mm 기준이지만,
// 이 앱은 체크포인트 단위 스냅샷이라 1시간 환산 값으로 단순화)
const SNOW_ID_MIN = 600
const SNOW_ID_MAX = 622 // OWM 6xx: snow 전체 범위
const STRONG_WIND_MS = 10.8 // 보퍼트 6등급(강풍) 근사치
const TYPHOON_WIND_MS = 14 // 기상청 강풍주의보 평균풍속(14m/s) 기준을 "태풍급"의 하한으로 재사용
const STORM_ID_MIN = 200
const STORM_ID_MAX = 599 // OWM 2xx(뇌우) ~ 5xx(비) 범위: 태풍 판정 시 "비/뇌우 동반" 여부 체크용
const FREEZING_TEMP_C = 0

export const HAZARD_META = {
  typhoon: { icon: '🌪️', label: '태풍급 강풍', tagType: 'danger' },
  heavy_rain: { icon: '🌧️', label: '폭우주의', tagType: 'danger' },
  snow: { icon: '❄️', label: '폭설주의', tagType: 'warning' },
  strong_wind: { icon: '💨', label: '강풍주의', tagType: 'warning' },
  freezing: { icon: '🥶', label: '빙판주의', tagType: 'info' },
}

/**
 * OWM 날씨 데이터를 화물차 관점의 위험 유형으로 분류한다.
 * @param {object} params
 * @param {number|null} params.id - weather[0].id (OWM condition code)
 * @param {string} [params.description] - weather[0].description (한글, lang=kr)
 * @param {number} params.temp - main.temp (섭씨)
 * @param {number} [params.windSpeed] - wind.speed (m/s)
 * @param {number} [params.rainVolume] - rain['1h'] ?? rain['3h'] ?? 0 (mm)
 * @returns {{ isDangerous: boolean, type: string|null, label: string|null, icon: string|null, tagType: string|null }}
 */
export function classifyWeatherHazard({
  id = null,
  description = '',
  temp,
  windSpeed = 0,
  rainVolume = 0,
}) {
  const isStormCode = id != null && id >= STORM_ID_MIN && id <= STORM_ID_MAX
  const isHeavyRain = HEAVY_RAIN_IDS.includes(id) || rainVolume >= HEAVY_RAIN_VOLUME_MM
  const isSnow =
    (id != null && id >= SNOW_ID_MIN && id <= SNOW_ID_MAX) || description.includes('눈')
  const isStrongWind = windSpeed >= STRONG_WIND_MS || description.includes('강풍')
  const isTyphoon = windSpeed >= TYPHOON_WIND_MS && isStormCode
  const isFreezing = typeof temp === 'number' && temp < FREEZING_TEMP_C

  // 우선순위: 여러 조건이 동시에 성립할 수 있으므로 더 심각한 유형을 우선한다.
  let type = null
  if (isTyphoon) type = 'typhoon'
  else if (isHeavyRain) type = 'heavy_rain'
  else if (isSnow) type = 'snow'
  else if (isStrongWind) type = 'strong_wind'
  else if (isFreezing) type = 'freezing'

  if (!type) {
    return { isDangerous: false, type: null, label: null, icon: null, tagType: null }
  }
  return { isDangerous: true, ...HAZARD_META[type], type }
}

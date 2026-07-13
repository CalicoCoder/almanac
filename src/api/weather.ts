export interface WeatherResponse {
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weathercode: number[]
    rain_sum: number[]
    snowfall_sum: number[]
    precipitation_hours: number[]
    wind_speed_10m_max: number[]
  }
}

export const FALLBACK_LOCATION = { latitude: 51.5074, longitude: -0.1278 } // London

export function getBrowserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (err) => reject(new Error(err.message || 'Unable to retrieve your location.')),
    )
  })
}

export function getLocation(): Promise<{ latitude: number; longitude: number }> {
  return getBrowserLocation().catch(() => FALLBACK_LOCATION)
}

export function getTodayIsoDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function fetchWeather(
  isoDate: string,
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  const isToday = isoDate === getTodayIsoDate()
  const baseUrl = isToday
    ? 'https://api.open-meteo.com/v1/forecast'
    : 'https://archive-api.open-meteo.com/v1/archive'

  const res = await fetch(
    `${baseUrl}?latitude=${latitude}&longitude=${longitude}` +
      `&start_date=${isoDate}&end_date=${isoDate}` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode,rain_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max&timezone=auto`,
  )

  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status}`)
  }

  return res.json()
}

import { useWeather } from '../hooks/useWeather'
import { getTodayIsoDate } from '../api/weather'

interface WeatherCardProps {
  isoDate: string
}

// Conversion to degrees minutes seconds, formula: https://www.latlong.net/degrees-minutes-seconds-to-decimal-degrees
function toDMS(decimal: number, positiveLabel: string, negativeLabel: string): string {
  const hemisphere = decimal >= 0 ? positiveLabel : negativeLabel
  const abs = Math.abs(decimal)
  const degrees = Math.floor(abs)
  const minutesFloat = (abs - degrees) * 60
  let minutes = Math.floor(minutesFloat)
  let seconds = Math.round((minutesFloat - minutes) * 60)

  if (seconds === 60) {
    seconds = 0
    minutes += 1
  }

  return `${degrees}° ${minutes}′ ${seconds}″ ${hemisphere}`
}

// Based on the WMO codes from open-meteo table
const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

export function WeatherCard({ isoDate }: WeatherCardProps) {
  const { data, isLoading, isError } = useWeather(isoDate)

  if (isLoading) {
    return <p className="text-center">Loading weather...</p>
  }

  if (isError || !data || data.weather.daily.time.length === 0) {
    return <p className="text-center text-red-500">No weather data available for this date.</p>
  }

  const { weather, latitude, longitude } = data
  const maxTemp = weather.daily.temperature_2m_max[0]
  const minTemp = weather.daily.temperature_2m_min[0]
  const code = weather.daily.weathercode[0]
  const description = WEATHER_DESCRIPTIONS[code] ?? 'Unknown conditions'
  const rainSum = weather.daily.rain_sum[0]
  const snowfallSum = weather.daily.snowfall_sum[0]
  const precipitationHours = weather.daily.precipitation_hours[0]
  const windSpeedMax = weather.daily.wind_speed_10m_max[0]

  const [year, month, day] = isoDate.split('-')
  const coords = `${toDMS(latitude, 'N', 'S')}, ${toDMS(longitude, 'E', 'W')}`
  const title =
    isoDate === getTodayIsoDate()
      ? `Forecast for Today @ (${coords})`
      : `Weather on ${month}/${day}/${year} @ (${coords})`

  return (
    <section className="mx-auto max-w-2xl rounded-md border border-gray-300 p-3 dark:border-gray-600">
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p>{description}</p>
      <p className="text-sm text-gray-400">
        <span className="text-white">High:</span> {maxTemp}&deg;C
      </p>
      <p className="text-sm text-gray-400">
        <span className="text-white">Low:</span> {minTemp}&deg;C
      </p>
      <p className="text-sm text-gray-400">
        <span className="text-white">Rain:</span> {rainSum} mm
      </p>
      <p className="text-sm text-gray-400">
        <span className="text-white">Snowfall:</span> {snowfallSum} cm
      </p>
      <p className="text-sm text-gray-400">
        <span className="text-white">Precipitation hours:</span> {precipitationHours}
      </p>
      <p className="text-sm text-gray-400">
        <span className="text-white">Max wind speed:</span> {windSpeedMax} km/h
      </p>
    </section>
  )
}

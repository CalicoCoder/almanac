import { useEffect, useState, type FormEvent } from 'react'
import { useWeather } from '../hooks/useWeather'
import { getTodayIsoDate, getBrowserLocation, FALLBACK_LOCATION } from '../api/weather'
import { reverseGeocode } from '../api/geocoding'
import { IconButton } from './IconButton'

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
  const [location, setLocation] = useState(FALLBACK_LOCATION)
  const [locationLabel, setLocationLabel] = useState<string | null>(null)
  const [latInput, setLatInput] = useState(String(FALLBACK_LOCATION.latitude))
  const [lngInput, setLngInput] = useState(String(FALLBACK_LOCATION.longitude))
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const { data, isLoading, isError } = useWeather(isoDate, location)

  // Resolve a display name for the default (London) fallback, without ever prompting for geolocation permission.
  useEffect(() => {
    let cancelled = false

    reverseGeocode(FALLBACK_LOCATION.latitude, FALLBACK_LOCATION.longitude)
      .then((result) => {
        if (!cancelled) setLocationLabel(result.label)
      })
      .catch(() => {
        if (!cancelled) setLocationLabel(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const lat = Number(latInput)
    const lng = Number(lngInput)

    if (latInput.trim() === '' || lngInput.trim() === '' || Number.isNaN(lat) || Number.isNaN(lng)) {
      setLocationError('Enter valid latitude and longitude values.')
      return
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationError('Latitude must be -90 to 90, longitude must be -180 to 180.')
      return
    }

    setLocationError(null)
    setLocationLabel(null)
    setLocation({ latitude: lat, longitude: lng })

    try {
      const result = await reverseGeocode(lat, lng)
      setLocationLabel(result.label)
    } catch {
      setLocationLabel(null)
    }
  }

  async function handleLocateMe() {
    setIsLocating(true)
    setLocationError(null)
    try {
      const coords = await getBrowserLocation()
      setLatInput(String(coords.latitude))
      setLngInput(String(coords.longitude))
      setLocation(coords)

      try {
        const result = await reverseGeocode(coords.latitude, coords.longitude)
        setLocationLabel(result.label)
      } catch {
        setLocationLabel(null)
      }
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'Could not determine your location.')
    } finally {
      setIsLocating(false)
    }
  }

  const locationControls = (
    <form onSubmit={handleSubmit} className="mb-3 flex flex-wrap items-center justify-start gap-2">
      <input
        type="number"
        step=".1"
        value={latInput}
        onChange={(e) => setLatInput(e.target.value)}
        placeholder="Latitude"
        className="w-32 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
      />
      <input
        type="number"
        step=".1"
        value={lngInput}
        onChange={(e) => setLngInput(e.target.value)}
        placeholder="Longitude"
        className="w-32 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
      />
      <IconButton type="submit">Set Location</IconButton>
      <IconButton type="button" onClick={handleLocateMe} disabled={isLocating}>
        {isLocating ? 'Locating...' : 'Locate me'}
      </IconButton>
      {locationError && <p className="w-full text-center text-sm text-red-500">{locationError}</p>}
    </form>
  )

  const [year, month, day] = isoDate.split('-')
  const dateLabel =
    isoDate === getTodayIsoDate() ? 'Forecast for Today' : `Weather on ${month}/${day}/${year}`

  if (Number(isoDate.split('-')[0]) < 1940) {
    return (
      <section className="mx-auto max-w-2xl rounded-md border border-gray-300 p-3 dark:border-gray-600">
        <h2 className="mb-2 text-xl font-bold">{dateLabel}</h2>
        {locationControls}
        <p className="text-center text-red-500">No weather data available prior to 1940.</p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-2xl rounded-md border border-gray-300 p-3 dark:border-gray-600">
        <h2 className="mb-2 text-xl font-bold">{dateLabel}</h2>
        {locationControls}
        <p className="text-center">Loading weather...</p>
      </section>
    )
  }

  if (isError || !data || data.weather.daily.time.length === 0) {
    return (
      <section className="mx-auto max-w-2xl rounded-md border border-gray-300 p-3 dark:border-gray-600">
        <h2 className="mb-2 text-xl font-bold">{dateLabel}</h2>
        {locationControls}
        <p className="text-center text-red-500">No weather data available for this date.</p>
      </section>
    )
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

  const coords = `${toDMS(latitude, 'N', 'S')}, ${toDMS(longitude, 'E', 'W')}`

  return (
    <section className="mx-auto max-w-2xl rounded-md border border-gray-300 p-3 dark:border-gray-600">
      <h2 className="mb-2 text-xl font-bold">{dateLabel}</h2>
      {locationControls}
      <h2 className="text-lg font-bold">Location Details</h2>
      {locationLabel && <p className="text-md">{locationLabel}</p>}
      <p className="mb-2 text-sm text-gray-400">{coords}</p>

      <h2 className="text-lg font-bold">Weather Details</h2>
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

import { useQuery } from '@tanstack/react-query'
import { fetchWeather, getLocation } from '../api/weather'

interface Coordinates {
  latitude: number
  longitude: number
}

export function useWeather(isoDate: string, location: Coordinates | null) {
  const year = Number(isoDate.split('-')[0])

  return useQuery({
    queryKey: ['weather', isoDate, location?.latitude, location?.longitude],
    queryFn: async () => {
      const { latitude, longitude } = location ?? (await getLocation())
      const weather = await fetchWeather(isoDate, latitude, longitude)
      return { weather, latitude, longitude }
    },
    enabled: year >= 1940,
  })
}

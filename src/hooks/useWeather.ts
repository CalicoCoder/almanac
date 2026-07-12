import { useQuery } from '@tanstack/react-query'
import { fetchWeather, getLocation } from '../api/weather'

export function useWeather(isoDate: string) {
  const year = Number(isoDate.split('-')[0])

  return useQuery({
    queryKey: ['weather', isoDate],
    queryFn: async () => {
      const { latitude, longitude } = await getLocation()
      const weather = await fetchWeather(isoDate, latitude, longitude)
      return { weather, latitude, longitude }
    },
    enabled: year >= 1940,
  })
}

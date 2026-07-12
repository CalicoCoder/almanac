import { useQuery } from '@tanstack/react-query'
import { fetchApod } from '../api/apod'

export function useApod(isoDate: string) {
  return useQuery({
    queryKey: ['apod', isoDate],
    queryFn: () => fetchApod(isoDate),
  })
}

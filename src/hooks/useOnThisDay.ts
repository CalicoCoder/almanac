import { useQuery } from '@tanstack/react-query'
import { fetchWikipediaOnThisDay } from '../api/onThisDay'

export function useOnThisDay(month: string, day: string) {
  return useQuery({
    queryKey: ['onThisDay', month, day],
    queryFn: () => fetchWikipediaOnThisDay(month, day),
  })
}

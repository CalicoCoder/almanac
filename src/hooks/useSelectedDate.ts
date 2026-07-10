import { useState } from 'react'

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useSelectedDate() {
  const [date, setDate] = useState(() => new Date())

  const isoDate = toISODate(date) // YYYY-MM-DD, for NASA/Open-Meteo
  const [year, month, day] = isoDate.split('-')

  function shiftDays(delta: number) {
    setDate((current) => {
      const newDay = new Date(current)
      newDay.setDate(newDay.getDate() + delta)
      return newDay
    })
  }

  function goToPreviousDay() {
    shiftDays(-1)
  }

  function goToNextDay() {
    shiftDays(1)
  }

  function jumpToDate(newIsoDate: string) {
    const [y, m, d] = newIsoDate.split('-').map(Number)
    setDate(new Date(y, m - 1, d)) // js date is 0 index, iso date is not
  }

  return {
    date,
    isoDate,
    year,
    month,
    day,
    goToPreviousDay,
    goToNextDay,
    jumpToDate,
  }
}

import type { useSelectedDate } from '../hooks/useSelectedDate'
import { IconButton } from './IconButton'

type DateNavigatorProps = ReturnType<typeof useSelectedDate>

export function DateNavigator({
  isoDate,
  goToPreviousDay,
  goToNextDay,
  jumpToDate,
}: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <IconButton onClick={goToPreviousDay} aria-label="Previous day">
        &larr;
      </IconButton>

      <input
        type="date"
        value={isoDate}
        onChange={(e) => jumpToDate(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
      />

      <IconButton onClick={goToNextDay} aria-label="Next day">
        &rarr;
      </IconButton>
    </div>
  )
}

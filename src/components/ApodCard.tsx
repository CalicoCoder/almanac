import { useApod } from '../hooks/useApod'
import { BookmarkButton } from './BookmarkButton'
import type { ApodBookmark } from '../types/bookmark'

interface ApodCardProps {
  isoDate: string
}

export function ApodCard({ isoDate }: ApodCardProps) {
  const { data, isLoading, isError, error } = useApod(isoDate)

  if (isLoading) {
    return <p className="text-center">Loading astronomy picture...</p>
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-500">
        <p>No astronomy picture available for this date.</p>
        {error instanceof Error && <p className="text-sm">{error.message}</p>}
      </div>
    )
  }

  const bookmark: ApodBookmark = {
    id: `apod-${data.date}`,
    type: 'apod',
    date: data.date,
    title: data.title,
    imageUrl: data.url,
    explanation: data.explanation,
  }

  return (
    <section className="mx-auto max-w-2xl rounded-md border border-gray-300 p-3 dark:border-gray-600">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">Astronomy Photo of the Day</h2>
        <BookmarkButton bookmark={bookmark} />
      </div>
      <h3 className="mb-2 text-l italic">{data.title}</h3>

      {data.media_type === 'image' ? (
        <img src={data.url} alt={data.title} className="mb-3 w-full rounded" />
      ) : (
        <p className="mb-3 text-sm text-gray-400">Photo of the day is a video for this day.</p> //TODO: Consider adding support for the mp4 files
      )}

      <p className="text-sm text-gray-400">{data.explanation}</p>
      {data.copyright && (
        <p className="mt-2 text-xs text-gray-500">&copy; {data.copyright}</p>
      )}
    </section>
  )
}

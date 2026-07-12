import { useBookmarksContext } from '../context/BookmarksContext'
import type { Bookmark } from '../types/bookmark'
import { IconButton } from './IconButton'

function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const { removeBookmark } = useBookmarksContext()

  return (
    <li className="flex flex-col items-center gap-3 rounded-md border border-gray-300 p-3 sm:flex-row sm:items-start dark:border-gray-600">
      {bookmark.type === 'apod' && (
        <img src={bookmark.imageUrl} alt={bookmark.title} className="h-24 w-24 rounded object-cover" />
      )}
      {(bookmark.type === 'birth' || bookmark.type === 'death') && bookmark.thumbnailUrl && (
        <img src={bookmark.thumbnailUrl} alt="" className="h-24 w-24 rounded object-cover" />
      )}

      <div className="w-full text-center sm:text-left">
        <p className="text-xs text-gray-400">{bookmark.date}</p>

        {bookmark.type === 'apod' && (
          <>
            <p className="font-medium">{bookmark.title}</p>
            <p className="text-sm text-gray-400">{bookmark.explanation}</p>
          </>
        )}
        {bookmark.type === 'event' && <p className="font-medium">{bookmark.text}</p>}
        {(bookmark.type === 'birth' || bookmark.type === 'death') && (
          <a href={bookmark.pageUrl} target="_blank" className="font-medium underline">
            {bookmark.name}
          </a>
        )}
        {(bookmark.type === 'birth' || bookmark.type === 'death') && bookmark.description && (
          <p className="text-sm text-gray-400">{bookmark.description}</p>
        )}
      </div>

      <IconButton onClick={() => removeBookmark(bookmark.id)} aria-label="Remove bookmark">
        Remove
      </IconButton>
    </li>
  )
}

export function BookmarksPage() {
  const { bookmarks } = useBookmarksContext()

  const apods = bookmarks.filter((b) => b.type === 'apod')
  const events = bookmarks.filter((b) => b.type === 'event')
  const births = bookmarks.filter((b) => b.type === 'birth')
  const deaths = bookmarks.filter((b) => b.type === 'death')

  if (bookmarks.length === 0) {
    return <p className="text-center text-gray-400">No bookmarks saved yet.</p>
  }

  return (
    <section className="mx-auto max-w-2xl">
      {apods.length > 0 && (
        <>
          <h2 className="mb-2 text-xl font-bold">Astronomy Pictures</h2>
          <ul className="mb-6 space-y-4">
            {apods.map((bookmark) => (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
          </ul>
        </>
      )}

      {events.length > 0 && (
        <>
          <h2 className="mb-2 text-xl font-bold">Historical Events</h2>
          <ul className="mb-6 space-y-4">
            {events.map((bookmark) => (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
          </ul>
        </>
      )}

      {births.length > 0 && (
        <>
          <h2 className="mb-2 text-xl font-bold">Births</h2>
          <ul className="mb-6 space-y-4">
            {births.map((bookmark) => (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
          </ul>
        </>
      )}

      {deaths.length > 0 && (
        <>
          <h2 className="mb-2 text-xl font-bold">Deaths</h2>
          <ul className="mb-6 space-y-4">
            {deaths.map((bookmark) => (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

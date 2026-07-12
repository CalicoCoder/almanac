import { useBookmarksContext } from '../context/BookmarksContext'
import type { Bookmark } from '../types/bookmark'

interface BookmarkButtonProps {
  bookmark: Bookmark
}

export function BookmarkButton({ bookmark }: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarksContext()
  const saved = isBookmarked(bookmark.id)

  return (
    <button
      type="button"
      onClick={() => (saved ? removeBookmark(bookmark.id) : addBookmark(bookmark))}
      aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={saved}
      className="text-xl"
    >
      {saved ? '★' : '☆'}
    </button>
  )
}

import { useEffect, useState } from 'react'
import type { Bookmark } from '../types/bookmark'

const STORAGE_KEY = 'almanac-bookmarks'

function loadBookmarks(): Bookmark[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  function addBookmark(bookmark: Bookmark) {
    setBookmarks((current) => [...current, bookmark])
  }

  function removeBookmark(id: string) {
    setBookmarks((current) => current.filter((b) => b.id !== id))
  }

  function isBookmarked(id: string) {
    return bookmarks.some((b) => b.id === id)
  }

  return { bookmarks, addBookmark, removeBookmark, isBookmarked }
}

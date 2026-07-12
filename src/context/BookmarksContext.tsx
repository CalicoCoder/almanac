import { createContext, useContext, type ReactNode } from 'react'
import { useBookmarks } from '../hooks/useBookmarks'

type BookmarksContextValue = ReturnType<typeof useBookmarks>

const BookmarksContext = createContext<BookmarksContextValue | null>(null)

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const value = useBookmarks()
  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext)
  if (!context) {
    throw new Error('useBookmarksContext must be used within a BookmarksProvider')
  }
  return context
}

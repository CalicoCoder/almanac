export interface ApodBookmark {
  id: string
  type: 'apod'
  date: string
  title: string
  imageUrl: string
  explanation: string
}

export interface EventBookmark {
  id: string
  type: 'event'
  date: string
  year: number
  text: string
}

export interface PersonBookmark {
  id: string
  type: 'birth' | 'death'
  date: string
  year: number
  name: string
  description?: string
  thumbnailUrl?: string
  pageUrl: string
}

export type Bookmark = ApodBookmark | EventBookmark | PersonBookmark

export interface OnThisDayEvent {
  text: string
  year: number
  pages: {
    title: string
    normalizedtitle?: string
    extract?: string
    description?: string
    thumbnail?: { source: string }
    content_urls?: { desktop: { page: string } }
  }[]
}

export interface OnThisDayResponse {
  events: OnThisDayEvent[]
  births: OnThisDayEvent[]
  deaths: OnThisDayEvent[]
}

export async function fetchWikipediaOnThisDay(month: string, day: string): Promise<OnThisDayResponse> {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${month}/${day}`,
  )

  if (!res.ok) {
    throw new Error(`Wikipedia On This Day request failed: ${res.status}`)
  }

  return res.json()
}

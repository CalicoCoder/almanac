export interface ApodResponse {
  title: string
  explanation: string
  date: string
  url: string
  hdurl?: string
  media_type: 'image' | 'video'
  copyright?: string
}

export async function fetchApod(isoDate: string): Promise<ApodResponse> {
  const apiKey = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?date=${isoDate}&api_key=${apiKey}`,
  )

  if (!res.ok) {
    throw new Error(`NASA APOD request failed: ${res.status}`)
  }

  return res.json()
}

export interface ApodResponse {
  title: string
  explanation: string
  date: string
  url: string
  hdurl?: string
  media_type: 'image' | 'video'
  copyright?: string
}

interface ApodErrorResponse {
  code: number
  msg: string
}

export async function fetchApod(isoDate: string): Promise<ApodResponse> {
  const apiKey = import.meta.env.VITE_NASA_API_KEY ?? 'DEMO_KEY'
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?date=${isoDate}&api_key=${apiKey}`,
  )

  if (!res.ok) {
    const body: ApodErrorResponse = await res.json()
    throw new Error(body.msg ?? `NASA APOD request failed: ${res.status}`)
  }

  return res.json()
}

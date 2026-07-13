export interface GeocodedLocation {
  latitude: number
  longitude: number
  label: string
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodedLocation> {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  )

  if (!res.ok) {
    throw new Error(`Reverse geocoding failed: ${res.status}`)
  }

  const body = await res.json()
  const city = body.city || body.locality || 'Unknown location'
  const label = body.countryCode ? `${city}, ${body.countryCode}` : city

  return { latitude, longitude, label }
}

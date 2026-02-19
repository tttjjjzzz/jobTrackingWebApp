export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeLocation(
  query: string,
): Promise<GeocodingResult | null> {
  if (!query.trim()) return null;

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'JobTrackerApp/1.0',
        },
      },
    );

    if (!response.ok) return null;

    const results = await response.json();
    if (results.length === 0) return null;

    return {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
      displayName: results[0].display_name,
    };
  } catch {
    return null;
  }
}

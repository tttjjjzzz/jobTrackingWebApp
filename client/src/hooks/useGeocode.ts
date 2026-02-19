import { useState, useCallback } from 'react';
import { geocodeLocation, type GeocodingResult } from '../utils/geocode';

interface UseGeocodeReturn {
  geocode: (query: string) => Promise<GeocodingResult | null>;
  isGeocoding: boolean;
}

export function useGeocode(): UseGeocodeReturn {
  const [isGeocoding, setIsGeocoding] = useState(false);

  const geocode = useCallback(async (query: string) => {
    setIsGeocoding(true);
    try {
      return await geocodeLocation(query);
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  return { geocode, isGeocoding };
}

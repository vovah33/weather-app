import type { GeocodingLocation } from '../types/location';

type GeocodingApiResult = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
};

type GeocodingApiResponse = {
  results?: GeocodingApiResult[];
  error?: boolean;
  reason?: string;
};

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(query: string): Promise<GeocodingLocation[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const url = new URL(GEOCODING_BASE_URL);
  url.searchParams.set('name', trimmedQuery);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to search locations.');
  }

  const data: GeocodingApiResponse = await response.json();

  if (data.error) {
    throw new Error(data.reason || 'Geocoding request failed.');
  }

  return (data.results ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
    admin1: item.admin1,
  }));
}
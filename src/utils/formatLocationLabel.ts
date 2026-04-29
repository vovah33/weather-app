import type { GeocodingLocation } from '../types/location';

export function formatLocationLabel(location: GeocodingLocation): string {
  if (location.admin1) {
    return `${location.name}, ${location.admin1}, ${location.country}`;
  }

  return `${location.name}, ${location.country}`;
}
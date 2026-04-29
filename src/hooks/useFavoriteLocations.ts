import { useEffect, useState } from 'react';
import type { GeocodingLocation } from '../types/location';

const FAVORITES_STORAGE_KEY = 'weather-app-favorite-locations';

function isGeocodingLocation(value: unknown): value is GeocodingLocation {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const location = value as Partial<GeocodingLocation>;

  return (
    typeof location.id === 'number' &&
    typeof location.name === 'string' &&
    typeof location.country === 'string' &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number'
  );
}

function readFavoriteLocations(): GeocodingLocation[] {
  try {
    const storedValue = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isGeocodingLocation);
  } catch {
    return [];
  }
}

export function useFavoriteLocations(selectedLocation: GeocodingLocation | null) {
  const [favoriteLocations, setFavoriteLocations] = useState<GeocodingLocation[]>(
    readFavoriteLocations,
  );

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteLocations));
  }, [favoriteLocations]);

  const isSelectedLocationFavorite =
    selectedLocation !== null &&
    favoriteLocations.some((location) => location.id === selectedLocation.id);

  function removeFavoriteLocation(locationId: number) {
    setFavoriteLocations((currentFavorites) =>
      currentFavorites.filter((location) => location.id !== locationId),
    );
  }

  function toggleFavoriteLocation() {
    if (!selectedLocation) {
      return;
    }

    setFavoriteLocations((currentFavorites) => {
      const isAlreadyFavorite = currentFavorites.some(
        (location) => location.id === selectedLocation.id,
      );

      if (isAlreadyFavorite) {
        return currentFavorites.filter(
          (location) => location.id !== selectedLocation.id,
        );
      }

      return [...currentFavorites, selectedLocation];
    });
  }

  return {
    favoriteLocations,
    isSelectedLocationFavorite,
    removeFavoriteLocation,
    toggleFavoriteLocation,
  };
}
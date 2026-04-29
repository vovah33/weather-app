import { useEffect, useRef, useState } from 'react';
import { searchLocations } from '../api/geocodingApi';
import type { GeocodingLocation } from '../types/location';

type UseLocationSuggestionsResult = {
  locationOptions: GeocodingLocation[];
  isLocationPickerOpen: boolean;
  showLocationOptions: (locations: GeocodingLocation[]) => void;
  clearLocationSuggestions: () => void;
  closeLocationPicker: () => void;
};

export function useLocationSuggestions(
  searchValue: string,
  selectedLocation: GeocodingLocation | null,
): UseLocationSuggestionsResult {
  const [locationOptions, setLocationOptions] = useState<GeocodingLocation[]>([]);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const suggestionsRequestIdRef = useRef(0);

  function clearLocationSuggestions() {
    suggestionsRequestIdRef.current += 1;
    setLocationOptions([]);
    setIsLocationPickerOpen(false);
  }

  function closeLocationPicker() {
    suggestionsRequestIdRef.current += 1;
    setIsLocationPickerOpen(false);
    setLocationOptions([]);
  }

  function showLocationOptions(locations: GeocodingLocation[]) {
    suggestionsRequestIdRef.current += 1;
    setLocationOptions(locations);
    setIsLocationPickerOpen(locations.length > 0);
  }

  useEffect(() => {
    const trimmedQuery = searchValue.trim();

    if (trimmedQuery.length < 2) {
      clearLocationSuggestions();
      return;
    }

    if (
      selectedLocation &&
      trimmedQuery.toLowerCase() === selectedLocation.name.trim().toLowerCase()
    ) {
      clearLocationSuggestions();
      return;
    }

    const requestId = ++suggestionsRequestIdRef.current;

    const timeoutId = window.setTimeout(async () => {
      try {
        const locations = await searchLocations(trimmedQuery);

        if (requestId !== suggestionsRequestIdRef.current) {
          return;
        }

        setLocationOptions(locations);
        setIsLocationPickerOpen(locations.length > 0);
      } catch {
        if (requestId !== suggestionsRequestIdRef.current) {
          return;
        }

        setLocationOptions([]);
        setIsLocationPickerOpen(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue, selectedLocation]);

  return {
    locationOptions,
    isLocationPickerOpen,
    showLocationOptions,
    clearLocationSuggestions,
    closeLocationPicker,
  };
}
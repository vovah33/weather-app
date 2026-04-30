import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [suggestionsQuery, setSuggestionsQuery] = useState('');

  const suggestionsRequestIdRef = useRef(0);

  const trimmedQuery = searchValue.trim();

  const isSelectedLocationQuery =
    selectedLocation !== null &&
    trimmedQuery.toLowerCase() === selectedLocation.name.trim().toLowerCase();

  const canSearchSuggestions =
    trimmedQuery.length >= 2 && !isSelectedLocationQuery;

  const clearLocationSuggestions = useCallback(() => {
    suggestionsRequestIdRef.current += 1;
    setLocationOptions([]);
    setIsPickerOpen(false);
    setSuggestionsQuery('');
  }, []);

  const closeLocationPicker = useCallback(() => {
    suggestionsRequestIdRef.current += 1;
    setLocationOptions([]);
    setIsPickerOpen(false);
    setSuggestionsQuery('');
  }, []);

  const showLocationOptions = useCallback(
    (locations: GeocodingLocation[]) => {
      suggestionsRequestIdRef.current += 1;
      setLocationOptions(locations);
      setSuggestionsQuery(searchValue.trim());
      setIsPickerOpen(locations.length > 0);
    },
    [searchValue],
  );

  useEffect(() => {
    if (!canSearchSuggestions) {
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
        setSuggestionsQuery(trimmedQuery);
        setIsPickerOpen(locations.length > 0);
      } catch {
        if (requestId !== suggestionsRequestIdRef.current) {
          return;
        }

        setLocationOptions([]);
        setSuggestionsQuery(trimmedQuery);
        setIsPickerOpen(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canSearchSuggestions, trimmedQuery]);

  const isLocationPickerOpen =
    canSearchSuggestions &&
    isPickerOpen &&
    suggestionsQuery === trimmedQuery &&
    locationOptions.length > 0;

  return {
    locationOptions,
    isLocationPickerOpen,
    showLocationOptions,
    clearLocationSuggestions,
    closeLocationPicker,
  };
}
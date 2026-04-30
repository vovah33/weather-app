import { useEffect, useState } from 'react';

import SearchSection from './components/searchbar/SearchSection';
import StatusMessage from './components/ui/StatusMessage';
import WeatherDashboard from './components/weather/WeatherDashboard';

import { searchLocations } from './api/geocodingApi';

import { useFavoriteLocations } from './hooks/useFavoriteLocations';
import { useLocationSuggestions } from './hooks/useLocationSuggestions';
import { useWeatherData } from './hooks/useWeatherData';

import type { GeocodingLocation } from './types/location';

const DEFAULT_CITY = 'Vlaardingen';

function App() {
  const [searchValue, setSearchValue] = useState(DEFAULT_CITY);

  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [searchErrorMessage, setSearchErrorMessage] = useState<string | null>(null);

  const {
    weatherData,
    selectedDayId,
    setSelectedDayId,
    selectedLocation,
    isWeatherLoading,
    weatherErrorMessage,
    loadWeatherByLocation,
  } = useWeatherData();

  const {
    favoriteLocations,
    isSelectedLocationFavorite,
    removeFavoriteLocation,
    toggleFavoriteLocation,
  } = useFavoriteLocations(selectedLocation);

  const {
    locationOptions,
    isLocationPickerOpen,
    showLocationOptions,
    clearLocationSuggestions,
    closeLocationPicker,
  } = useLocationSuggestions(searchValue, selectedLocation);

  async function loadLocationAndSyncSearch(location: GeocodingLocation) {
    const wasLoaded = await loadWeatherByLocation(location);

    if (!wasLoaded) {
      return;
    }

    setSearchValue(location.name);
    clearLocationSuggestions();
  }

  async function loadWeatherByCity(cityQuery: string) {
    const trimmedQuery = cityQuery.trim();

    if (!trimmedQuery) {
      setSearchErrorMessage('Enter a city name.');
      clearLocationSuggestions();
      return;
    }

    setIsSearchingLocation(true);
    setSearchErrorMessage(null);
    clearLocationSuggestions();

    try {
      const locations = await searchLocations(trimmedQuery);

      if (!locations.length) {
        throw new Error('City not found.');
      }

      if (locations.length === 1) {
        await loadLocationAndSyncSearch(locations[0]);
        return;
      }

      showLocationOptions(locations);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to search locations.';

      setSearchErrorMessage(message);
    } finally {
      setIsSearchingLocation(false);
    }
  }

  function handleSelectLocation(location: GeocodingLocation) {
    void loadLocationAndSyncSearch(location);
  }

  useEffect(() => {
    void loadWeatherByCity(DEFAULT_CITY);
  }, []);

  const isLoading = isSearchingLocation || isWeatherLoading;
  const errorMessage = searchErrorMessage ?? weatherErrorMessage;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(79,172,254,0.18),transparent_34rem),linear-gradient(180deg,#eef7ff_0%,#f7fbff_45%,#edf3f8_100%)] text-slate-800">
      <SearchSection
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearchSubmit={() => {
          void loadWeatherByCity(searchValue);
        }}
        isLoading={isLoading}
        favoriteLocations={favoriteLocations}
        onSelectFavoriteLocation={handleSelectLocation}
        onRemoveFavoriteLocation={removeFavoriteLocation}
        isLocationPickerOpen={isLocationPickerOpen}
        locationOptions={locationOptions}
        onSelectLocation={handleSelectLocation}
        onCloseLocationPicker={closeLocationPicker}
      />

      <main className="mx-auto max-w-[1100px] px-4 py-8 md:py-12">
        <StatusMessage
          errorMessage={errorMessage}
          isLoading={isLoading}
          hasWeatherData={weatherData !== null}
        />

        {weatherData && (
          <WeatherDashboard
            weatherData={weatherData}
            selectedLocation={selectedLocation}
            selectedDayId={selectedDayId}
            onSelectDay={setSelectedDayId}
            isSelectedLocationFavorite={isSelectedLocationFavorite}
            onToggleFavoriteLocation={toggleFavoriteLocation}
          />
        )}
      </main>
    </div>
  );
}

export default App;
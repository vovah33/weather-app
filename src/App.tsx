import { useEffect, useState } from 'react';
import './App.css';

import SearchBar from './components/searchbar/searchbar';
import SearchResultsPicker from './components/searchbar/SearchResultsPicker';
import WeatherDashboard from './components/weather/WeatherDashboard';

import { searchLocations } from './api/geocodingApi';

import { useFavoriteLocations } from './hooks/useFavoriteLocations';
import { useLocationSuggestions } from './hooks/useLocationSuggestions';
import { useWeatherData } from './hooks/useWeatherData';

import type { GeocodingLocation } from './types/location';

function App() {
  const [searchValue, setSearchValue] = useState('Vlaardingen');

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

  function handleSelectFavoriteLocation(location: GeocodingLocation) {
    void loadLocationAndSyncSearch(location);
  }

  useEffect(() => {
    void loadWeatherByCity('Vlaardingen');
  }, []);

  const isLoading = isSearchingLocation || isWeatherLoading;
  const errorMessage = searchErrorMessage ?? weatherErrorMessage;

  return (
    <div className="app">
      <div className="search-shell">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSubmit={() => {
            void loadWeatherByCity(searchValue);
          }}
          isLoading={isLoading}
          favoriteLocations={favoriteLocations}
          onSelectFavoriteLocation={handleSelectFavoriteLocation}
          onRemoveFavoriteLocation={removeFavoriteLocation}
        />

        {isLocationPickerOpen && locationOptions.length > 0 && (
          <SearchResultsPicker
            locations={locationOptions}
            onSelectLocation={handleSelectLocation}
            onClose={closeLocationPicker}
          />
        )}
      </div>

      <main className="main">
        {errorMessage && <p className="status status--error">{errorMessage}</p>}

        {!weatherData && isLoading && (
          <p className="status">Loading weather data...</p>
        )}

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
import { useState } from 'react';
import { getWeatherScreenData } from '../api/weatherApi';
import type { GeocodingLocation } from '../types/location';
import type { WeatherScreenData } from '../types/weather';

export function useWeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherScreenData | null>(null);
  const [selectedDayId, setSelectedDayId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<GeocodingLocation | null>(null);

  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherErrorMessage, setWeatherErrorMessage] = useState<string | null>(null);

  function applyLoadedWeatherData(
    location: GeocodingLocation,
    nextWeatherData: WeatherScreenData,
  ) {
    setWeatherData(nextWeatherData);
    setSelectedDayId(nextWeatherData.todayId);
    setSelectedLocation(location);
  }

  async function loadWeatherByLocation(location: GeocodingLocation): Promise<boolean> {
    setIsWeatherLoading(true);
    setWeatherErrorMessage(null);

    try {
      const nextWeatherData = await getWeatherScreenData(location);
      applyLoadedWeatherData(location, nextWeatherData);

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load weather data.';

      setWeatherErrorMessage(message);

      return false;
    } finally {
      setIsWeatherLoading(false);
    }
  }

  return {
    weatherData,
    selectedDayId,
    setSelectedDayId,
    selectedLocation,
    isWeatherLoading,
    weatherErrorMessage,
    loadWeatherByLocation,
  };
}
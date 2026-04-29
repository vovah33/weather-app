import CurrentCityBar from './CurrentCityBar';
import WeatherOverview from './WeatherOverview';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';

import type { GeocodingLocation } from '../../types/location';
import type { WeatherScreenData } from '../../types/weather';

type WeatherDashboardProps = {
  weatherData: WeatherScreenData;
  selectedLocation: GeocodingLocation | null;
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  isSelectedLocationFavorite: boolean;
  onToggleFavoriteLocation: () => void;
};

export default function WeatherDashboard({
  weatherData,
  selectedLocation,
  selectedDayId,
  onSelectDay,
  isSelectedLocationFavorite,
  onToggleFavoriteLocation,
}: WeatherDashboardProps) {
  const isTodaySelected = selectedDayId === weatherData.todayId;

  const selectedDailyOverview =
    weatherData.dailyOverviewByDayId[selectedDayId];

  const visibleHourlyForecast =
    weatherData.hourlyByDayId[selectedDayId] ?? [];

  const currentHourIdForSelectedDay =
    selectedDayId === weatherData.todayId ? weatherData.currentHourId : null;

  return (
    <>
      {selectedLocation && (
        <CurrentCityBar
          location={selectedLocation}
          isFavorite={isSelectedLocationFavorite}
          onToggleFavorite={onToggleFavoriteLocation}
        />
      )}

      {isTodaySelected ? (
        <WeatherOverview
          mode="current"
          data={weatherData.currentOverview}
        />
      ) : (
        selectedDailyOverview && (
          <WeatherOverview
            mode="daily"
            data={selectedDailyOverview}
          />
        )
      )}

      {visibleHourlyForecast.length > 0 && (
        <HourlyForecast
          items={visibleHourlyForecast}
          currentHourId={currentHourIdForSelectedDay}
        />
      )}

      <DailyForecast
        items={weatherData.dailyForecast}
        selectedDayId={selectedDayId}
        onSelectDay={onSelectDay}
      />
    </>
  );
}
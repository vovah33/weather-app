import type { GeocodingLocation } from '../types/location';
import type {
  DailyForecastItem,
  HourlyForecastItem,
  WeatherOverviewCurrentData,
  WeatherOverviewDailyData,
  WeatherScreenData,
} from '../types/weather';
import { mapWeatherCodeToIcon, mapWeatherCodeToLabel } from '../utils/weatherCodeMap';

type ForecastApiResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    visibility: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: Array<number | null>;
    temperature_2m_min: Array<number | null>;
    wind_speed_10m_max: Array<number | null>;
    precipitation_probability_max: Array<number | null>;
  };
};

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

function roundNumber(value: number | null | undefined): number {
  return Math.round(value ?? 0);
}

function formatHourLabel(isoDateTime: string): string {
  const hour24 = Number(isoDateTime.slice(11, 13));
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${hour12} ${suffix}`;
}

function formatDateLabel(dateKey: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${dateKey}T12:00:00`));
}

function formatDayLabel(dateKey: string, index: number): string {
  if (index === 0) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(new Date(`${dateKey}T12:00:00`));
}

function mapWindDirection(angle: number): string {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const normalized = ((angle % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;

  return directions[index];
}

function buildLocationLabel(location: GeocodingLocation): string {
  return `${location.name}, ${location.country}`;
}

export async function getWeatherScreenData(
  location: GeocodingLocation,
): Promise<WeatherScreenData> {
  const url = new URL(FORECAST_BASE_URL);

  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));

  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
    ].join(','),
  );

  url.searchParams.set(
    'hourly',
    ['temperature_2m', 'weather_code'].join(','),
  );

  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'wind_speed_10m_max',
      'precipitation_probability_max',
    ].join(','),
  );

  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('forecast_days', '8');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to load weather forecast.');
  }

  const data: ForecastApiResponse = await response.json();
  const locationLabel = buildLocationLabel(location);

  const currentDateKey = data.current.time.slice(0, 10);
  const currentHourId = `${data.current.time.slice(0, 13)}:00`;
  const todayId = data.daily.time[0] ?? currentDateKey;

  const currentOverview: WeatherOverviewCurrentData = {
    location: locationLabel,
    dateLabel: formatDateLabel(currentDateKey),
    timeLabel: formatHourLabel(data.current.time),
    temperature: roundNumber(data.current.temperature_2m),
    feelsLike: roundNumber(data.current.apparent_temperature),
    windSpeed: roundNumber(data.current.wind_speed_10m),
    visibilityKm: roundNumber((data.current.visibility ?? 0) / 1000),
    windDirection: mapWindDirection(data.current.wind_direction_10m),
    icon: mapWeatherCodeToIcon(data.current.weather_code),
  };

  const dailyForecast: DailyForecastItem[] = data.daily.time.map((dateKey, index) => ({
    id: dateKey,
    day: formatDayLabel(dateKey, index),
    minTemperature: roundNumber(data.daily.temperature_2m_min[index]),
    maxTemperature: roundNumber(data.daily.temperature_2m_max[index]),
    icon: mapWeatherCodeToIcon(data.daily.weather_code[index]),
  }));

  const dailyOverviewByDayId = data.daily.time.reduce<Record<string, WeatherOverviewDailyData>>(
    (accumulator, dateKey, index) => {
      accumulator[dateKey] = {
        location: locationLabel,
        dateLabel: formatDateLabel(dateKey),
        minTemperature: roundNumber(data.daily.temperature_2m_min[index]),
        maxTemperature: roundNumber(data.daily.temperature_2m_max[index]),
        conditionLabel: mapWeatherCodeToLabel(data.daily.weather_code[index]),
        windSpeed: roundNumber(data.daily.wind_speed_10m_max[index]),
        precipitationChance: roundNumber(data.daily.precipitation_probability_max[index]),
        icon: mapWeatherCodeToIcon(data.daily.weather_code[index]),
      };

      return accumulator;
    },
    {},
  );

  const hourlyByDayId = data.hourly.time.reduce<Record<string, HourlyForecastItem[]>>(
    (accumulator, isoDateTime, index) => {
      const dateKey = isoDateTime.slice(0, 10);

      const item: HourlyForecastItem = {
        id: isoDateTime,
        dateKey,
        time: formatHourLabel(isoDateTime),
        temperature: roundNumber(data.hourly.temperature_2m[index]),
        icon: mapWeatherCodeToIcon(data.hourly.weather_code[index]),
      };

      if (!accumulator[dateKey]) {
        accumulator[dateKey] = [];
      }

      accumulator[dateKey].push(item);

      return accumulator;
    },
    {},
  );

  return {
    todayId,
    currentHourId,
    currentOverview,
    dailyForecast,
    dailyOverviewByDayId,
    hourlyByDayId,
  };
}
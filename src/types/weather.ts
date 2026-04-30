export type WeatherIconKey = 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | 'fog';

export type HourlyCardStatus = 'past' | 'current' | 'future';

export type HourlyForecastItem = {
  id: string;       // ISO datetime, example: 2026-04-21T13:00
  dateKey: string;  // ISO date, example: 2026-04-21
  time: string;     // UI label, example: 1 PM
  temperature: number;
  icon: WeatherIconKey;
};

export type DailyForecastItem = {
  id: string;       // ISO date, example: 2026-04-21
  day: string;      // UI label, example: Tuesday
  minTemperature: number;
  maxTemperature: number;
  icon: WeatherIconKey;
};

export type WeatherOverviewCurrentData = {
  location: string;
  dateLabel: string;
  timeLabel: string;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  visibilityKm: number;
  windDirection: string;
  icon: WeatherIconKey;
};

export type WeatherOverviewDailyData = {
  location: string;
  dateLabel: string;
  minTemperature: number;
  maxTemperature: number;
  conditionLabel: string;
  windSpeed: number;
  precipitationChance: number;
  icon: WeatherIconKey;
};

export type WeatherOverviewProps =
  | {
      mode: 'current';
      data: WeatherOverviewCurrentData;
    }
  | {
      mode: 'daily';
      data: WeatherOverviewDailyData;
    };

export type WeatherScreenData = {
  todayId: string;
  currentHourId: string;
  currentOverview: WeatherOverviewCurrentData;
  dailyForecast: DailyForecastItem[];
  dailyOverviewByDayId: Record<string, WeatherOverviewDailyData>;
  hourlyByDayId: Record<string, HourlyForecastItem[]>;
};
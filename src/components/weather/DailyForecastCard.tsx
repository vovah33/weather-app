import sunIcon from '../../assets/Icons/sun.png';
import cloudIcon from '../../assets/Icons/cloud.png';
import rainIcon from '../../assets/Icons/rain.png';
import snowIcon from '../../assets/Icons/snow.png';
import stormIcon from '../../assets/Icons/storm.png';
import fogIcon from '../../assets/Icons/fog.png';
import type { DailyForecastItem, WeatherIconKey } from '../../types/weather';

type DailyForecastCardProps = {
  item: DailyForecastItem;
  isSelected: boolean;
  onSelect: (dayId: string) => void;
};

const iconMap: Record<WeatherIconKey, string> = {
  sun: sunIcon,
  cloud: cloudIcon,
  rain: rainIcon,
  snow: snowIcon,
  storm: stormIcon,
  fog: fogIcon,
};

export default function DailyForecastCard({
  item,
  isSelected,
  onSelect,
}: DailyForecastCardProps) {
  const iconSrc = iconMap[item.icon];

  return (
    <button
      type="button"
      className={`forecast-card ${isSelected ? 'forecast-card--selected' : ''}`}
      onClick={() => onSelect(item.id)}
    >
      <p>{item.day}</p>
      <img
        className="weather-icon"
        src={iconSrc}
        alt="Weather icon"
      />
      <p>
        {item.minTemperature}-{item.maxTemperature}°C
      </p>
    </button>
  );
}
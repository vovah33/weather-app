import sunIcon from '../../assets/Icons/sun.png';
import cloudIcon from '../../assets/Icons/cloud.png';
import rainIcon from '../../assets/Icons/rain.png';
import snowIcon from '../../assets/Icons/snow.png';
import stormIcon from '../../assets/Icons/storm.png';
import fogIcon from '../../assets/Icons/fog.png';

import type { HourlyForecastItem, WeatherIconKey } from '../../types/weather';

type HourlyCardStatus = 'past' | 'current' | 'future';

type HourlyForecastCardProps = {
  item: HourlyForecastItem;
  status: HourlyCardStatus;
};

const iconMap: Record<WeatherIconKey, string> = {
  sun: sunIcon,
  cloud: cloudIcon,
  rain: rainIcon,
  snow: snowIcon,
  storm: stormIcon,
  fog: fogIcon,
};

export default function HourlyForecastCard({
  item,
  status,
}: HourlyForecastCardProps) {
  const iconSrc = iconMap[item.icon];

  return (
    <article className={`forecast-card hourly-card hourly-card--${status}`}>
      <p>{item.time}</p>

      <img
        className="weather-icon"
        src={iconSrc}
        alt="Weather icon"
      />

      <p>{item.temperature}°C</p>
    </article>
  );
}
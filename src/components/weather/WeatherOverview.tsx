import sunIcon from '../../assets/Icons/sun.png';
import cloudIcon from '../../assets/Icons/cloud.png';
import rainIcon from '../../assets/Icons/rain.png';
import snowIcon from '../../assets/Icons/snow.png';
import stormIcon from '../../assets/Icons/storm.png';
import fogIcon from '../../assets/Icons/fog.png';
import type { WeatherIconKey, WeatherOverviewProps } from '../../types/weather';

const iconMap: Record<WeatherIconKey, string> = {
  sun: sunIcon,
  cloud: cloudIcon,
  rain: rainIcon,
  snow: snowIcon,
  storm: stormIcon,
  fog: fogIcon,
};

export default function WeatherOverview(props: WeatherOverviewProps) {
  if (props.mode === 'current') {
    const { data } = props;
    const iconSrc = iconMap[data.icon];

    return (
      <section className="weather-overview">
        <div className="weather-overview__location">
          <p>{data.location}</p>
          <p>{data.dateLabel}</p>
          <p>{data.timeLabel}</p>
        </div>

        <div className="weather-overview__main">
          <img
            className="weather-icon weather-icon--large"
            src={iconSrc}
            alt="Current weather icon"
          />
          <p className="current-temperature">{data.temperature}°C</p>
        </div>

        <div className="weather-overview__details">
          <p>Feels like: {data.feelsLike}°C</p>
          <p>Wind: {data.windSpeed} km/h</p>
          <p>Visibility: {data.visibilityKm} km</p>
          <p>Wind direction: {data.windDirection}</p>
        </div>
      </section>
    );
  }

  const { data } = props;
  const iconSrc = iconMap[data.icon];

  return (
    <section className="weather-overview">
      <div className="weather-overview__location">
        <p>{data.location}</p>
        <p>{data.dateLabel}</p>
        <p>Daily forecast</p>
      </div>

      <div className="weather-overview__main">
        <img
          className="weather-icon weather-icon--large"
          src={iconSrc}
          alt="Daily weather icon"
        />
        <p className="current-temperature">
          {data.minTemperature}-{data.maxTemperature}°C
        </p>
      </div>

      <div className="weather-overview__details">
        <p>Condition: {data.conditionLabel}</p>
        <p>Wind: {data.windSpeed} km/h</p>
        <p>Chance of rain: {data.precipitationChance}%</p>
      </div>
    </section>
  );
}
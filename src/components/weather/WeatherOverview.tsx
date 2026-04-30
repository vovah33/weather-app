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

const overviewCardClass =
  'mx-auto mb-9 max-w-[760px] rounded-[1.75rem] border border-slate-300/30 bg-gradient-to-b from-white/95 to-sky-50/90 p-7 text-center shadow-2xl shadow-slate-900/10 backdrop-blur';

const locationClass =
  'mb-5 flex flex-col items-center gap-1 font-bold text-slate-700';

const mainWeatherClass =
  'mx-auto mb-6 flex max-w-[360px] items-center justify-center gap-6 rounded-3xl border border-slate-200 bg-white/80 px-6 py-5 shadow-xl shadow-slate-900/10';

const detailCardClass =
  'flex min-h-[74px] items-center justify-center rounded-2xl border border-slate-200 bg-white/85 px-3 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-900/10 ring-1 ring-white/80';

export default function WeatherOverview(props: WeatherOverviewProps) {
  if (props.mode === 'current') {
    const { data } = props;
    const iconSrc = iconMap[data.icon];

    return (
      <section className={overviewCardClass}>
        <div className={locationClass}>
          <p className="text-xl text-slate-800">{data.location}</p>
          <p className="text-sm text-slate-500">{data.dateLabel}</p>
          <p className="text-sm text-slate-500">{data.timeLabel}</p>
        </div>

        <div className={mainWeatherClass}>
          <img
            className="h-28 w-28 object-contain drop-shadow-xl"
            src={iconSrc}
            alt="Current weather icon"
          />

          <p className="text-5xl font-extrabold tracking-tight text-slate-950">
            {data.temperature}°C
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <p className={detailCardClass}>Feels like: {data.feelsLike}°C</p>
          <p className={detailCardClass}>Wind: {data.windSpeed} km/h</p>
          <p className={detailCardClass}>Visibility: {data.visibilityKm} km</p>
          <p className={detailCardClass}>Wind direction: {data.windDirection}</p>
        </div>
      </section>
    );
  }

  const { data } = props;
  const iconSrc = iconMap[data.icon];

  return (
    <section className={overviewCardClass}>
      <div className={locationClass}>
        <p className="text-xl text-slate-800">{data.location}</p>
        <p className="text-sm text-slate-500">{data.dateLabel}</p>
        <p className="text-sm text-slate-500">Daily forecast</p>
      </div>

      <div className={mainWeatherClass}>
        <img
          className="h-28 w-28 object-contain drop-shadow-xl"
          src={iconSrc}
          alt="Daily weather icon"
        />

        <p className="text-5xl font-extrabold tracking-tight text-slate-950">
          {data.minTemperature}-{data.maxTemperature}°C
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <p className={detailCardClass}>Condition: {data.conditionLabel}</p>
        <p className={detailCardClass}>Wind: {data.windSpeed} km/h</p>
        <p className={detailCardClass}>
          Chance of rain: {data.precipitationChance}%
        </p>
      </div>
    </section>
  );
}
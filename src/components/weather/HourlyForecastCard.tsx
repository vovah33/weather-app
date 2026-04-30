import sunIcon from '../../assets/Icons/sun.png';
import cloudIcon from '../../assets/Icons/cloud.png';
import rainIcon from '../../assets/Icons/rain.png';
import snowIcon from '../../assets/Icons/snow.png';
import stormIcon from '../../assets/Icons/storm.png';
import fogIcon from '../../assets/Icons/fog.png';

import type {
  HourlyCardStatus,
  HourlyForecastItem,
  WeatherIconKey,
} from '../../types/weather';

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

function getCardClassName(status: HourlyCardStatus): string {
  const baseClassName =
    'relative flex min-h-22 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center shadow-lg transition-transform';

  if (status === 'past') {
    return `${baseClassName} border-slate-300/70 bg-slate-300 text-slate-500`;
  }

  if (status === 'current') {
    return `${baseClassName} z-10 -translate-y-1.5 border-amber-400 bg-white text-slate-950 shadow-xl shadow-amber-500/30 ring-4 ring-amber-400/40`;
  }

  return `${baseClassName} border-slate-300/40 bg-white/80 text-slate-800 shadow-slate-900/10 hover:-translate-y-0.5 hover:border-sky-300`;
}

export default function HourlyForecastCard({
  item,
  status,
}: HourlyForecastCardProps) {
  const iconSrc = iconMap[item.icon];

  return (
    <article className={getCardClassName(status)}>
      {status === 'current' && (
        <span className="absolute -top-3 rounded-full bg-amber-400 px-2 py-0.5 text-[0.65rem] font-bold leading-none text-slate-900">
          Now
        </span>
      )}

      <p className="m-0 whitespace-nowrap text-xs font-semibold leading-tight">
        {item.time}
      </p>

      <img
        className={`h-7 w-7 object-contain ${
          status === 'past' ? 'opacity-55' : ''
        }`}
        src={iconSrc}
        alt="Weather icon"
      />

      <p className="m-0 whitespace-nowrap text-xs font-bold leading-tight">
        {item.temperature}°C
      </p>
    </article>
  );
}
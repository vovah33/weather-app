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

function getCardClassName(isSelected: boolean): string {
  const baseClassName =
    'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-4 text-center shadow-lg transition-transform hover:-translate-y-0.5 hover:border-sky-300';

  if (isSelected) {
    return `${baseClassName} border-sky-400 bg-white shadow-sky-500/20 ring-4 ring-sky-400/20`;
  }

  return `${baseClassName} border-slate-300/30 bg-white/80 shadow-slate-900/10`;
}

export default function DailyForecastCard({
  item,
  isSelected,
  onSelect,
}: DailyForecastCardProps) {
  const iconSrc = iconMap[item.icon];

  return (
    <button
      type="button"
      className={getCardClassName(isSelected)}
      onClick={() => onSelect(item.id)}
    >
      <p className="m-0 text-sm font-bold text-slate-800">{item.day}</p>

      <img
        className="h-12 w-12 object-contain"
        src={iconSrc}
        alt="Weather icon"
      />

      <p className="m-0 text-sm font-semibold text-slate-700">
        {item.minTemperature}-{item.maxTemperature}°C
      </p>
    </button>
  );
}
import { useState } from 'react';
import type { HourlyCardStatus, HourlyForecastItem } from '../../types/weather';
import HourlyForecastCard from './HourlyForecastCard';

type HourlyForecastProps = {
  items: HourlyForecastItem[];
  currentHourId: string | null;
};

const ITEMS_PER_PAGE = 12;

function getHourlyCardStatus(
  item: HourlyForecastItem,
  currentHourId: string | null,
): HourlyCardStatus {
  if (currentHourId === null) {
    return 'future';
  }

  if (item.id < currentHourId) {
    return 'past';
  }

  if (item.id === currentHourId) {
    return 'current';
  }

  return 'future';
}

function getInitialStartIndex(
  items: HourlyForecastItem[],
  currentHourId: string | null,
): number {
  if (currentHourId === null) {
    return 0;
  }

  const currentHourIndex = items.findIndex((item) => item.id === currentHourId);

  if (currentHourIndex === -1) {
    return 0;
  }

  return Math.floor(currentHourIndex / ITEMS_PER_PAGE) * ITEMS_PER_PAGE;
}

export default function HourlyForecast({
  items,
  currentHourId,
}: HourlyForecastProps) {
  const [startIndex, setStartIndex] = useState(() =>
    getInitialStartIndex(items, currentHourId),
  );

  const maxStartIndex = Math.max(items.length - ITEMS_PER_PAGE, 0);
  const safeStartIndex = Math.min(startIndex, maxStartIndex);
  const visibleItems = items.slice(safeStartIndex, safeStartIndex + ITEMS_PER_PAGE);

  const canGoBack = safeStartIndex > 0;
  const canGoForward = safeStartIndex < maxStartIndex;

  function handlePreviousClick() {
    setStartIndex((currentIndex) =>
      Math.max(currentIndex - ITEMS_PER_PAGE, 0),
    );
  }

  function handleNextClick() {
    setStartIndex((currentIndex) =>
      Math.min(currentIndex + ITEMS_PER_PAGE, maxStartIndex),
    );
  }

  return (
    <section
      className="relative left-1/2 mb-10 grid w-[calc(100vw-2rem)] -translate-x-1/2 grid-cols-[48px_minmax(0,1100px)_48px] items-stretch justify-center gap-3 max-lg:grid-cols-[44px_minmax(0,1fr)_44px] max-md:grid-cols-[40px_minmax(0,1fr)_40px] max-md:gap-2"
      aria-label="Hourly forecast"
    >
      <button
        type="button"
        className="flex min-h-22 cursor-pointer items-center justify-center rounded-xl border-0 bg-white/75 text-2xl text-slate-400 shadow-lg shadow-slate-900/10 transition-colors hover:bg-white hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handlePreviousClick}
        disabled={!canGoBack}
        aria-label="Show previous hours"
      >
        ◀
      </button>

      <div className="grid grid-cols-12 gap-2 max-lg:grid-cols-6 max-md:grid-cols-4">
        {visibleItems.map((item) => (
          <HourlyForecastCard
            key={item.id}
            item={item}
            status={getHourlyCardStatus(item, currentHourId)}
          />
        ))}
      </div>

      <button
        type="button"
        className="flex min-h-22 cursor-pointer items-center justify-center rounded-xl border-0 bg-white/75 text-2xl text-slate-400 shadow-lg shadow-slate-900/10 transition-colors hover:bg-white hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleNextClick}
        disabled={!canGoForward}
        aria-label="Show next hours"
      >
        ▶
      </button>
    </section>
  );
}
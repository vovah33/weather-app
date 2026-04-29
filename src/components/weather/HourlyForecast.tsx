import { useEffect, useState } from 'react';
import type { HourlyForecastItem } from '../../types/weather';
import HourlyForecastCard from './HourlyForecastCard';

type HourlyForecastProps = {
  items: HourlyForecastItem[];
  currentHourId: string | null;
};

const ITEMS_PER_PAGE = 12;

type HourlyCardStatus = 'past' | 'current' | 'future';

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
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setStartIndex(getInitialStartIndex(items, currentHourId));
  }, [items, currentHourId]);

  const maxStartIndex = Math.max(items.length - ITEMS_PER_PAGE, 0);
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex < maxStartIndex;

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
    <section className="hourly-forecast" aria-label="Hourly forecast">
      <button
        type="button"
        className="hourly-forecast__nav-button"
        onClick={handlePreviousClick}
        disabled={!canGoBack}
        aria-label="Show previous hours"
      >
        ◀
      </button>

      <div className="hourly-forecast__grid">
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
        className="hourly-forecast__nav-button"
        onClick={handleNextClick}
        disabled={!canGoForward}
        aria-label="Show next hours"
      >
        ▶
      </button>
    </section>
  );
}
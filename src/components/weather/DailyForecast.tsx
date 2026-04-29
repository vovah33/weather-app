import type { DailyForecastItem } from '../../types/weather';
import DailyForecastCard from './DailyForecastCard';

type DailyForecastProps = {
  items: DailyForecastItem[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
};

export default function DailyForecast({
  items,
  selectedDayId,
  onSelectDay,
}: DailyForecastProps) {
  return (
    <section className="daily-forecast">
      <h2 className="section-title">Next 7 days</h2>

      <div className="daily-forecast__grid">
        {items.map((item) => (
          <DailyForecastCard
            key={item.id}
            item={item}
            isSelected={item.id === selectedDayId}
            onSelect={onSelectDay}
          />
        ))}
      </div>
    </section>
  );
}
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
    <section className="text-center">
      <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-950">
        Next 7 days
      </h2>

      <div className="grid grid-cols-8 gap-4 max-lg:grid-cols-4 max-md:grid-cols-2">
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
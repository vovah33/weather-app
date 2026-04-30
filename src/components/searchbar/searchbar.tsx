import type { FormEvent } from 'react';
import type {
  GeocodingLocation,
  RemoveLocationHandler,
  SelectLocationHandler,
} from '../../types/location';
import FavoritesDropdown from './FavoritesDropdown';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  favoriteLocations: GeocodingLocation[];
  onSelectFavoriteLocation: SelectLocationHandler;
  onRemoveFavoriteLocation: RemoveLocationHandler;
};

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
  favoriteLocations,
  onSelectFavoriteLocation,
  onRemoveFavoriteLocation,
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <header className="bg-linear-to-r from-sky-600 to-sky-400 p-4 shadow-lg shadow-sky-500/20">
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={handleSubmit}
      >
        <input
          className="w-60 rounded-xl border-0 bg-white px-4 py-3 text-lg text-slate-900 shadow-md outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/70"
          type="text"
          placeholder="Search city..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
        />

        <button
          className="cursor-pointer rounded-xl border-0 bg-sky-800 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>

        <FavoritesDropdown
          locations={favoriteLocations}
          onSelectLocation={onSelectFavoriteLocation}
          onRemoveLocation={onRemoveFavoriteLocation}
        />
      </form>
    </header>
  );
}
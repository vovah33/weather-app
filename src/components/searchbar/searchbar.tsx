import type { FormEvent } from 'react';
import type { GeocodingLocation } from '../../types/location';
import FavoritesDropdown from './FavoritesDropdown';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  favoriteLocations: GeocodingLocation[];
  onSelectFavoriteLocation: (location: GeocodingLocation) => void;
  onRemoveFavoriteLocation: (locationId: number) => void;
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
    <header className="header">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Search city..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
        />

        <button className="search-button" type="submit" disabled={isLoading}>
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
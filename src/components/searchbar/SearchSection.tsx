import SearchBar from './searchbar';
import SearchResultsPicker from './SearchResultsPicker';

import type { GeocodingLocation } from '../../types/location';

type SearchSectionProps = {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  isLoading: boolean;

  favoriteLocations: GeocodingLocation[];
  onSelectFavoriteLocation: (location: GeocodingLocation) => void;
  onRemoveFavoriteLocation: (locationId: number) => void;

  isLocationPickerOpen: boolean;
  locationOptions: GeocodingLocation[];
  onSelectLocation: (location: GeocodingLocation) => void;
  onCloseLocationPicker: () => void;
};

export default function SearchSection({
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  isLoading,
  favoriteLocations,
  onSelectFavoriteLocation,
  onRemoveFavoriteLocation,
  isLocationPickerOpen,
  locationOptions,
  onSelectLocation,
  onCloseLocationPicker,
}: SearchSectionProps) {
  return (
    <div className="relative">
      <SearchBar
        value={searchValue}
        onChange={onSearchValueChange}
        onSubmit={onSearchSubmit}
        isLoading={isLoading}
        favoriteLocations={favoriteLocations}
        onSelectFavoriteLocation={onSelectFavoriteLocation}
        onRemoveFavoriteLocation={onRemoveFavoriteLocation}
      />

      {isLocationPickerOpen && locationOptions.length > 0 && (
        <SearchResultsPicker
          locations={locationOptions}
          onSelectLocation={onSelectLocation}
          onClose={onCloseLocationPicker}
        />
      )}
    </div>
  );
}
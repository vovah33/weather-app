import type { GeocodingLocation } from '../../types/location';
import { formatLocationLabel } from '../../utils/formatLocationLabel';

type SearchResultsPickerProps = {
  locations: GeocodingLocation[];
  onSelectLocation: (location: GeocodingLocation) => void;
  onClose: () => void;
};

export default function SearchResultsPicker({
  locations,
  onSelectLocation,
  onClose,
}: SearchResultsPickerProps) {
  return (
    <div className="search-results-picker">
      <div className="search-results-picker__header">
        <p className="search-results-picker__title">Choose a city</p>

        <button
          type="button"
          className="search-results-picker__close"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <ul className="search-results-picker__list">
        {locations.map((location) => (
          <li key={location.id} className="search-results-picker__list-item">
            <button
              type="button"
              className="search-results-picker__item"
              onClick={() => onSelectLocation(location)}
            >
              {formatLocationLabel(location)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
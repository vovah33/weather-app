import { useEffect, useRef, useState } from 'react';
import type { GeocodingLocation } from '../../types/location';
import { formatLocationLabel } from '../../utils/formatLocationLabel';

type FavoritesDropdownProps = {
  locations: GeocodingLocation[];
  onSelectLocation: (location: GeocodingLocation) => void;
  onRemoveLocation: (locationId: number) => void;
};

export default function FavoritesDropdown({
  locations,
  onSelectLocation,
  onRemoveLocation,
}: FavoritesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const clickedElement = event.target;

      if (!(clickedElement instanceof Node)) {
        return;
      }

      if (!dropdownRef.current?.contains(clickedElement)) {
        setIsOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  function handleSelectLocation(location: GeocodingLocation) {
    onSelectLocation(location);
    setIsOpen(false);
  }

  function handleRemoveLocation(locationId: number) {
    onRemoveLocation(locationId);
  }

  return (
    <div className="favorites-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="favorites-dropdown__toggle"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        Favorites
      </button>

      {isOpen && (
        <div className="favorites-dropdown__menu">
          {locations.length === 0 ? (
            <p className="favorites-dropdown__empty">No favorite cities yet.</p>
          ) : (
            <ul className="favorites-dropdown__list">
              {locations.map((location) => (
                <li className="favorites-dropdown__item" key={location.id}>
                  <button
                    type="button"
                    className="favorites-dropdown__city"
                    onClick={() => handleSelectLocation(location)}
                  >
                    {formatLocationLabel(location)}
                  </button>

                  <button
                    type="button"
                    className="favorites-dropdown__remove"
                    onClick={() => handleRemoveLocation(location.id)}
                    aria-label={`Remove ${location.name} from favorites`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
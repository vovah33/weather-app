import { useEffect, useRef, useState } from 'react';
import type {
  GeocodingLocation,
  RemoveLocationHandler,
  SelectLocationHandler,
} from '../../types/location';
import { formatLocationLabel } from '../../utils/formatLocationLabel';

type FavoritesDropdownProps = {
  locations: GeocodingLocation[];
  onSelectLocation: SelectLocationHandler;
  onRemoveLocation: RemoveLocationHandler;
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
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="cursor-pointer rounded-xl border-0 bg-sky-800 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-sky-900"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        Favorites
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 max-h-80 w-80 overflow-y-auto rounded-2xl border border-slate-300/60 bg-white p-3 shadow-2xl shadow-slate-900/20">
          {locations.length === 0 ? (
            <p className="m-0 text-slate-500">No favorite cities yet.</p>
          ) : (
            <ul className="m-0 grid list-none gap-2 p-0">
              {locations.map((location) => (
                <li
                  className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  key={location.id}
                >
                  <button
                    type="button"
                    className="flex-1 cursor-pointer border-0 bg-transparent px-3 py-3 text-left text-slate-800 transition-colors hover:bg-sky-50"
                    onClick={() => handleSelectLocation(location)}
                  >
                    {formatLocationLabel(location)}
                  </button>

                  <button
                    type="button"
                    className="cursor-pointer border-0 bg-slate-200 px-3 py-3 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-800"
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
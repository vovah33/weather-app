import type {
  GeocodingLocation,
  SelectLocationHandler,
} from '../../types/location';
import { formatLocationLabel } from '../../utils/formatLocationLabel';

type SearchResultsPickerProps = {
  locations: GeocodingLocation[];
  onSelectLocation: SelectLocationHandler;
  onClose: () => void;
};

export default function SearchResultsPicker({
  locations,
  onSelectLocation,
  onClose,
}: SearchResultsPickerProps) {
  return (
    <div className="mx-auto mt-3 max-w-275 rounded-2xl border border-slate-300/60 bg-white p-4 shadow-2xl shadow-slate-900/15">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-bold text-slate-900">Choose a city</p>

        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent text-slate-500 transition-colors hover:text-slate-900"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <ul className="m-0 grid list-none gap-3 p-0">
        {locations.map((location) => (
          <li key={location.id} className="m-0">
            <button
              type="button"
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-800 transition-colors hover:border-sky-400 hover:bg-sky-50"
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
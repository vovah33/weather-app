import starEmptyIcon from '../../assets/Icons/star-empty.png';
import starFullIcon from '../../assets/Icons/star-full.png';
import type { GeocodingLocation } from '../../types/location';

type CurrentCityBarProps = {
  location: GeocodingLocation;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function CurrentCityBar({
  location,
  isFavorite,
  onToggleFavorite,
}: CurrentCityBarProps) {
  return (
    <div className="mb-5 flex items-center justify-center gap-3 text-center">
      <p className="m-0 font-semibold text-slate-700">
        Current city: {location.name}, {location.country}
      </p>

      <button
        type="button"
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-white/75 p-1.5 shadow-md transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sky-500"
        onClick={onToggleFavorite}
        aria-label={
          isFavorite ? 'Remove city from favorites' : 'Add city to favorites'
        }
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <img
          className="block h-6 w-6 object-contain"
          src={isFavorite ? starFullIcon : starEmptyIcon}
          alt=""
        />
      </button>
    </div>
  );
}
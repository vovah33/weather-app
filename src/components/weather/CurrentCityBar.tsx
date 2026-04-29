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
    <div className="current-city">
      <p className="current-city__text">
        Current city: {location.name}, {location.country}
      </p>

      <button
        type="button"
        className="current-city__favorite-button"
        onClick={onToggleFavorite}
        aria-label={
          isFavorite ? 'Remove city from favorites' : 'Add city to favorites'
        }
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <img
          className="current-city__favorite-icon"
          src={isFavorite ? starFullIcon : starEmptyIcon}
          alt=""
        />
      </button>
    </div>
  );
}
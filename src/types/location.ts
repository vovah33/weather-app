export type GeocodingLocation = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
};

export type SelectLocationHandler = (location: GeocodingLocation) => void;

export type RemoveLocationHandler = (locationId: number) => void;
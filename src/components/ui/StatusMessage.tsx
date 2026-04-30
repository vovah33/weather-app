type StatusMessageProps = {
  errorMessage: string | null;
  isLoading: boolean;
  hasWeatherData: boolean;
};

export default function StatusMessage({
  errorMessage,
  isLoading,
  hasWeatherData,
}: StatusMessageProps) {
  if (errorMessage) {
    return <p className="mb-4 text-center text-red-700">{errorMessage}</p>;
  }

  if (!hasWeatherData && isLoading) {
    return (
      <p className="mb-4 text-center text-slate-600">
        Loading weather data...
      </p>
    );
  }

  return null;
}
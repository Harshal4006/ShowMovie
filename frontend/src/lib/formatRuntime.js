export const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) return "—";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
};

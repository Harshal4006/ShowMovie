export const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const formatTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const computeStats = (shows) => [
  { label: "Total Shows", value: shows.length, color: "text-white" },
  { label: "Active", value: shows.filter((s) => s.status === "active").length, color: "text-green-400" },
  { label: "Sold Out", value: shows.filter((s) => s.status === "sold-out").length, color: "text-red-400" },
  { label: "Upcoming", value: shows.filter((s) => s.status === "upcoming").length, color: "text-blue-400" },
];

import { Calendar, Clock, Film } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const DateTimeInfo = ({ showDateTime, theater, screenType }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Date</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-100">
          {formatDate(showDateTime)}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Time</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-100">
          {formatTime(showDateTime)}
        </p>
      </div>

      {(theater || screenType) && (
        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-400">Theater</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-100">
            {theater || "N/A"}{screenType ? ` • ${screenType}` : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimeInfo;
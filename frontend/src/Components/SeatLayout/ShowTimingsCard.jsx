import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock4, MapPin, IndianRupee } from "lucide-react";

const formatShowDate = (dateString) => {
  if (!dateString) return "";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ShowTimingsCard = ({ movie, date, time, showPrice }) => {
  const movieId = movie?.id ?? movie?._id;
  const title = movie?.title ?? "Selected movie";

  const theatre = useMemo(() => "ShowMovie Cinemas • Screen 2", []);

  return (
    <div className="rounded-4xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-100 sm:text-3xl sm:truncate">{title}</h1>

          <div className="mt-4 flex min-w-0 flex-wrap gap-2 text-sm text-gray-300 sm:gap-3">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="min-w-0 truncate">{formatShowDate(date)}</span>
            </span>
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Clock4 className="h-4 w-4 text-gray-400" />
              <span className="min-w-0 truncate">{time}</span>
            </span>
            {typeof showPrice === "number" && (
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <IndianRupee className="text-gray-400 inline self-center" size={14}/>
                {showPrice} / seat
              </span>
            )}
            <span className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="min-w-0 truncate">{theatre}</span>
            </span>
          </div>
        </div>

        {movieId && (
          <Link
            to={`/movies/${movieId}`}
            className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-100 transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 sm:w-auto sm:px-4 sm:py-2.5 sm:rounded-full"
          >
            Change time
          </Link>
        )}
      </div>
    </div>
  );
};

export default ShowTimingsCard;

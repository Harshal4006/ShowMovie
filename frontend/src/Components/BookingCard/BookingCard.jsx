import { memo } from "react";
import { Link } from "react-router-dom";
import { Ticket, IndianRupee, Calendar, Clock, MapPin } from "lucide-react";

const PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Image";

const formatDate = (d) => {
  if (!d) return "N/A";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (d) => {
  if (!d) return "N/A";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
};

const normalizePoster = (movie) => {
  if (!movie) return PLACEHOLDER;
  if (movie.posterUrl) return movie.posterUrl;
  if (movie.posterPath) return `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
  if (movie.poster_path) return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  return PLACEHOLDER;
};

const statusConfig = {
  confirmed: { bg: "bg-green-500/20", text: "text-green-400", ring: "ring-green-500/30", dot: "bg-green-400", label: "Confirmed" },
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-300", ring: "ring-yellow-500/30", dot: "bg-yellow-400", label: "Pending" },
  cancelled: { bg: "bg-gray-500/20", text: "text-gray-300", ring: "ring-gray-500/30", dot: "bg-gray-400", label: "Cancelled" },
};

const BookingCard = ({ booking }) => {
  const { show, amount, bookedSeats, isPaid, status, _id } = booking;
  const movie = show?.movie;
  const showDateTime = show?.showDateTime;
  const theater = show?.theater;
  const screenType = show?.screenType;
  const seats = bookedSeats || [];
  const movieId = movie?.tmdbId || movie?._id || movie?.id || "";

  const derivedStatus = status === "cancelled" ? "cancelled" : isPaid ? "confirmed" : "pending";

  const statusStyle = statusConfig[derivedStatus] || statusConfig.pending;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-3 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-red-500/25 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)] sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.08),transparent_40%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Poster - hidden on mobile, shown on sm+ */}
        <Link
          to={`/movies/${movieId}`}
          className="relative hidden w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/[0.06] transition-all duration-300 hover:ring-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] sm:block"
        >
          <div className="aspect-[2/3] h-32 overflow-hidden">
            <img
              src={normalizePoster(movie)}
              alt={movie?.title || "Movie"}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </Link>

        {/* Info area */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Top row: Title + Status */}
          <div className="flex items-start justify-between gap-2">
            <Link to={`/movies/${movieId}`} className="min-w-0">
              <h3 className="truncate text-base font-bold text-white sm:text-lg">
                {movie?.title || "Unknown Movie"}
              </h3>
            </Link>
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 backdrop-blur-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {statusStyle.label}
            </span>
          </div>

          {/* Meta row */}
          <p className="truncate text-xs text-gray-500">
            {movie?.releaseDate?.split("-")[0] || movie?.release_date?.split("-")[0] || "—"}
            {movie?.genres?.length > 0 && ` • ${movie.genres.slice(0, 2).map((g) => g.name).join(", ")}`}
            {movie?.runtime && ` • ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
          </p>

          {/* Date, Time, Theater row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
            {showDateTime && (
              <>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  {formatDate(showDateTime)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  {formatTime(showDateTime)}
                </span>
              </>
            )}
            {theater && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-500" />
                {theater}{screenType ? ` • ${screenType}` : ""}
              </span>
            )}
          </div>

          {/* Seats + Amount row */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-gray-500">Seats</p>
              <p className="truncate text-sm font-semibold text-gray-200">
                {seats.length > 0 ? seats.slice().sort().join(", ") : "—"}
              </p>
              <p className="text-[10px] text-gray-600">{seats.length} seat{seats.length === 1 ? "" : "s"}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] font-medium text-gray-500">Amount</p>
              <p className="text-lg font-bold text-white">
                <IndianRupee size={14} className="inline" />
                {amount != null ? Number(amount).toFixed(0) : "—"}
              </p>
            </div>
          </div>

          {/* Footer row: Book Again + Booking ID */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <Link
              to={`/movies/${movieId}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(239,68,68,0.2)] transition-all duration-300 hover:bg-red-400 hover:shadow-[0_6px_20px_rgba(239,68,68,0.3)] active:scale-[0.97]"
            >
              <Ticket className="h-3 w-3" />
              Book Again
            </Link>
            <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
              <Ticket className="h-3 w-3 text-gray-600" />
              ID: {_id?.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoBookingCard = memo(BookingCard);
MemoBookingCard.displayName = "BookingCard";
export default MemoBookingCard;

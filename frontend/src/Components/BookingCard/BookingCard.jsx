import { Link } from "react-router-dom";
import { formatRuntime } from "../../lib/formatRuntime.js";
import MoviePoster from "./MoviePoster";
import { MovieInfo, MovieMeta } from "./MovieInfo";
import DateTimeInfo from "./DateTimeInfo";
import BookingDetails from "./BookingDetails";
import BookingFooter from "./BookingFooter";

const BookingCard = ({ booking }) => {
  const { show, amount, bookedSeats, isPaid } = booking;
  const movie = show?.movie;
  const showDateTime = show?.showDateTime;
  const showPrice = show?.showPrice;

  const releaseYear = movie?.release_date?.split("-")[0] || "2026";
  const genres = movie?.genres?.slice(0, 2).map((genre) => genre.name).join(", ") || "Action";

  return (
    <div
      data-reveal="zoom"
      className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-red-500/35 hover:shadow-[0_24px_55px_rgba(127,29,29,0.22)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_38%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <MoviePoster movie={movie} isPaid={isPaid} />

      <div className="relative px-2 pb-2 pt-5">
        <MovieInfo movie={movie} />
        <MovieMeta movie={movie} />

        <DateTimeInfo showDateTime={showDateTime} />

        <BookingDetails
          bookedSeats={bookedSeats}
          amount={amount}
          showPrice={showPrice}
        />

        <BookingFooter movieId={movie?.id} bookingId={booking._id} />
      </div>
    </div>
  );
};

export default BookingCard;
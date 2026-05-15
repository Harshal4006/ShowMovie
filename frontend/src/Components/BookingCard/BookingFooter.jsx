import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

const BookingFooter = ({ movieId, bookingId }) => {
  return (
    <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/8 pt-5">
      <Link
        to={`/movies/${movieId}`}
        className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(239,68,68,0.24)] transition duration-300 hover:bg-red-400"
      >
        Book Again
      </Link>

      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-gray-200">
        <Ticket className="h-4 w-4 fill-red-500 text-red-500" />
        <span className="font-medium">Booking ID: {bookingId?.slice(-6)}</span>
      </div>
    </div>
  );
};

export default BookingFooter;
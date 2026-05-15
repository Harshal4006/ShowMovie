import { IndianRupee } from "lucide-react";

const BookingDetails = ({ bookedSeats, amount, showPrice }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-medium text-gray-400">Seats</p>
        <p className="mt-2 text-sm font-semibold text-gray-100">
          {bookedSeats?.length > 0
            ? bookedSeats.slice().sort().join(", ")
            : "No seats"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {bookedSeats?.length} seat{bookedSeats?.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-medium text-gray-400">Amount</p>
        <p className="mt-2 text-2xl font-bold text-white"><IndianRupee size={20} className="inline self-center" />{amount}</p>
        <p className="mt-1 text-xs text-gray-500"><IndianRupee size={12} className="inline self-center" />{showPrice} per seat</p>
      </div>
    </div>
  );
};

export default BookingDetails;
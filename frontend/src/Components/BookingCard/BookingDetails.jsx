import { IndianRupee, CheckCircle, XCircle, Clock } from "lucide-react";

const BookingDetails = ({ bookedSeats, amount, showPrice, status }) => {
  const seats = bookedSeats || [];
  const count = seats.length;

  const statusIcon = {
    confirmed: <CheckCircle className="h-3.5 w-3.5 text-green-400" />,
    cancelled: <XCircle className="h-3.5 w-3.5 text-red-400" />,
    completed: <Clock className="h-3.5 w-3.5 text-blue-400" />,
  }[status] || null;

  const statusLabel = {
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
  }[status] || "Unknown";

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-medium text-gray-400">Seats</p>
        <p className="mt-2 text-sm font-semibold text-gray-100">
          {count > 0
            ? seats.slice().sort().join(", ")
            : "No seats"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {count} seat{count === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-medium text-gray-400">Amount</p>
        <p className="mt-2 text-2xl font-bold text-white">
          <IndianRupee size={18} className="inline self-center" />
          {amount != null ? Number(amount).toFixed(0) : "—"}
        </p>
        {showPrice != null && (
          <p className="mt-1 text-xs text-gray-500">
            <IndianRupee size={10} className="inline self-center" />
            {Number(showPrice).toFixed(0)} per seat
          </p>
        )}
      </div>

      {status && (
        <div className="col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Booking Status</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
            {statusIcon}
            {statusLabel}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
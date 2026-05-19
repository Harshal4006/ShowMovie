import { X, CheckCircle, Clock, XCircle, IndianRupee } from "lucide-react";

const BookingModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const statusConfig = {
    paid: { icon: CheckCircle, class: "bg-green-500/10 text-green-400" },
    pending: { icon: Clock, class: "bg-yellow-500/10 text-yellow-400" },
    cancelled: { icon: XCircle, class: "bg-red-500/10 text-red-400" },
  };

  const StatusIcon = statusConfig[booking.paymentStatus]?.icon || Clock;
  const statusClass = statusConfig[booking.paymentStatus]?.class || statusConfig.pending.class;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold">Booking Details</h3>
            <p className="text-sm text-gray-500 mt-0.5">{booking.bookingId}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">User</div>
              <div className="mt-1 font-medium">{booking.userName}</div>
            </div>
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">Email</div>
              <div className="mt-1 font-medium">{booking.userEmail}</div>
            </div>
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">Movie</div>
              <div className="mt-1 font-medium">{booking.movieName}</div>
            </div>
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">Theater</div>
              <div className="mt-1 font-medium">{booking.theater}</div>
            </div>
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">Seats</div>
              <div className="mt-1 font-medium">{booking.seats}</div>
            </div>
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">Amount</div>
              <div className="flex items-center font-bold text-lg text-green-400"><IndianRupee size={16} className="inline self-center" />{booking.amount}</div>
            </div>
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">Date</div>
              <div className="mt-1 font-medium">{booking.bookingDate}</div>
            </div>
            <div className="rounded-lg bg-gray-900 p-3">
              <div className="text-xs text-gray-500">Time</div>
              <div className="mt-1 font-medium">{booking.bookingTime}</div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div>
              <div className="text-xs text-gray-500">Payment Status</div>
              <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                <StatusIcon size={14} />
                {booking.paymentStatus}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
import { useMemo, useState } from "react";
import { MoreVertical, CheckCircle, XCircle, Clock, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

const BookingsTable = ({ bookings, onView, onUpdateStatus }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ensure bookings is always an array
  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);

  const totalPages = Math.max(1, Math.ceil(safeBookings.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageBookings = safeBookings.slice(pageStartIndex, pageStartIndex + pageSize);

  const fromRow = safeBookings.length === 0 ? 0 : pageStartIndex + 1;
  const toRow = Math.min(safeBookings.length, pageStartIndex + pageSize);

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: "Paid", icon: CheckCircle, className: "bg-green-500/10 text-green-400 border border-green-500/20" },
      pending: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
      cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-500/10 text-red-400 border border-red-500/20" },
      refunded: { label: "Refunded", icon: XCircle, className: "bg-gray-500/10 text-gray-400 border border-gray-500/20" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-500/10 text-gray-400 border border-gray-500/20" };
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {Icon && <Icon size={12} />}
        {config.label}
      </span>
    );
  };

  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full min-w-[550px]">
          <thead className="bg-gray-900/50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-3 py-3">Booking ID</th>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3 hidden xl:table-cell">Movie</th>
              <th className="px-3 py-3 hidden lg:table-cell">Seats</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3 hidden md:table-cell">Date</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {pageBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              pageBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-3 py-3">
                    <div className="font-mono text-sm font-medium text-blue-400">{booking.bookingId}</div>
                    <div className="text-xs text-gray-500 mt-0.5 hidden xl:block">{booking.paymentMethod}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-400 shrink-0">
                        {booking.userName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate max-w-24">{booking.userName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-24 hidden sm:block">{booking.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden xl:table-cell">
                    <div className="font-medium text-sm">{booking.movieName}</div>
                    <div className="text-xs text-gray-500">{booking.theater}</div>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <div className="font-medium text-sm">{booking.seats}</div>
                    <div className="text-xs text-gray-500">{booking.tickets} tickets</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center font-bold text-sm"><IndianRupee size={14} className="inline self-center" />{booking.amount}</div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <div className="text-sm">{booking.bookingDate}</div>
                    <div className="text-xs text-gray-500">{booking.bookingTime}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.paymentStatus)}
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs text-gray-300 hover:bg-gray-700 focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 px-1 py-3">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`min-w-[36px] rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  num === currentPage
                    ? "bg-red-600 text-white"
                    : "border border-gray-700 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
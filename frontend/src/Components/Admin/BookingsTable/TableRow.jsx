import { IndianRupee } from "lucide-react";
import StatusBadge from "./StatusBadge";

const TableRow = ({ booking, onStatusChange }) => (
  <tr className="hover:bg-gray-800/30 transition-colors">
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
        <StatusBadge status={booking.paymentStatus} />
        <select
          value={booking.paymentStatus}
          onChange={(e) => onStatusChange(booking.id, e.target.value)}
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
);

export default TableRow;

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import TableRow from "./TableRow";
import TablePagination from "./TablePagination";

const BookingsTable = ({ bookings, onUpdateStatus }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);

  const totalPages = Math.max(1, Math.ceil(safeBookings.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageBookings = safeBookings.slice(pageStartIndex, pageStartIndex + pageSize);

  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
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
                <TableRow
                  key={booking.id}
                  booking={booking}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default BookingsTable;

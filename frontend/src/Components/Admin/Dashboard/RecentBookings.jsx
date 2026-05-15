import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Activity, CheckCircle, AlertCircle } from "lucide-react";

const RecentBookings = ({ recentBookings }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2 rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Latest customer transactions</p>
        </div>
        <button
          onClick={() => navigate("/admin/list-bookings")}
          className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 sm:px-5 py-3.5">User</th>
              <th className="px-4 sm:px-5 py-3.5">Movie</th>
              <th className="px-4 sm:px-5 py-3.5 hidden sm:table-cell">Seats</th>
              <th className="px-4 sm:px-5 py-3.5">Amount</th>
              <th className="px-4 sm:px-5 py-3.5 hidden md:table-cell">Date</th>
              <th className="px-4 sm:px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 sm:px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-400">
                      {booking.user.charAt(0)}
                    </div>
                    <span className="font-medium text-sm truncate max-w-[80px] sm:max-w-[100px]">{booking.user}</span>
                  </div>
                </td>
                <td className="px-4 sm:px-5 py-4 text-sm truncate max-w-[80px] sm:max-w-[120px]">{booking.movie}</td>
                <td className="px-4 sm:px-5 py-4 text-sm text-gray-400 hidden sm:table-cell">{booking.seats}</td>
                <td className="px-4 sm:px-5 py-4 font-semibold text-sm">{booking.amount}</td>
                <td className="px-4 sm:px-5 py-4 text-sm text-gray-500 hidden md:table-cell">{booking.date}</td>
                <td className="px-4 sm:px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    booking.status === "Paid"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {booking.status === "Paid" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-900/30">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} />
          <span>Last updated: Today, 12:30 PM</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity size={14} />
          <span>Real-time</span>
        </div>
      </div>
    </div>
  );
};

export default RecentBookings;
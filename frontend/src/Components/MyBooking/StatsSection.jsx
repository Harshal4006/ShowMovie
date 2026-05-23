import { IndianRupee } from "lucide-react";

const StatsSection = ({ totalBookings, paidBookings, pendingBookings, totalAmount }) => {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
        <p className="text-sm font-medium text-gray-400">Total Bookings</p>
        <p className="mt-2 text-3xl font-bold text-white">{totalBookings}</p>
        <p className="mt-1 text-xs text-gray-500">All time</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
        <p className="text-sm font-medium text-gray-400">Paid</p>
        <p className="mt-2 text-3xl font-bold text-green-400">{paidBookings}</p>
        <p className="mt-1 text-xs text-gray-500">Confirmed & paid</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
        <p className="text-sm font-medium text-gray-400">Pending</p>
        <p className="mt-2 text-3xl font-bold text-yellow-400">{pendingBookings}</p>
        <p className="mt-1 text-xs text-gray-500">Awaiting payment</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
        <p className="text-sm font-medium text-gray-400">Total Spent</p>
        <p className="mt-2 text-3xl font-bold text-white"><IndianRupee size={22} className="text-white/80 inline" />{totalAmount}</p>
        <p className="mt-1 text-xs text-gray-500">Across all bookings</p>
      </div>
    </div>
  );
};

export default StatsSection;
import { BarChart3, Download, Search, Calendar, Filter } from "lucide-react";
import toast from "react-hot-toast";

const BookingsActionBar = ({ searchQuery, setSearchQuery, dateFilter, setDateFilter, statusFilter, setStatusFilter, onExport }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row md:flex-wrap lg:flex-nowrap gap-3">
        <button
          onClick={() => toast.success("Analytics dashboard coming soon!")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          <BarChart3 size={18} />
          Analytics
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-5 py-2.5 font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-wrap lg:flex-nowrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 py-2 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Date Filter */}
        <div className="relative w-full sm:w-auto min-w-[130px]">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 pl-9 pr-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-auto min-w-[130px] max-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 pl-8 pr-8 py-2 text-sm text-white appearance-none cursor-pointer focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookingsActionBar;
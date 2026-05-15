import { Plus, Download, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const ShowsActionBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedCount,
  bulkOpen,
  setBulkOpen,
  onAddNew,
  onExport,
  onBulkDelete,
  onApplyStatus,
  onClearSelection,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row md:flex-wrap lg:flex-nowrap gap-3">
        <button
          onClick={onAddNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          Add New Show
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

        {/* Status Filter */}
        <div className="relative w-full sm:w-auto min-w-[130px] max-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 pl-8 pr-8 py-2 text-sm text-white appearance-none cursor-pointer focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="sold-out">Sold Out</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {/* Bulk Actions */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => {
              if (selectedCount === 0) {
                toast.error("Select at least one show first");
                return;
              }
              setBulkOpen((prev) => !prev);
            }}
            className={`w-full sm:w-auto rounded-xl border border-gray-700 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCount > 0 ? "bg-red-600/10 border-red-500/50 text-red-400 hover:bg-red-600/20" : "hover:bg-gray-800"
            }`}
          >
            Bulk ({selectedCount})
          </button>

          {bulkOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-800 bg-gray-950 shadow-xl overflow-hidden">
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-800">
                Selected: <span className="font-medium text-white">{selectedCount}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onBulkDelete();
                  setBulkOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left text-sm text-red-400 hover:bg-gray-900"
              >
                Delete Selected
              </button>
              <div className="border-t border-gray-800" />
              <button type="button" onClick={() => onApplyStatus("active")} className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-900">Mark Active</button>
              <button type="button" onClick={() => onApplyStatus("inactive")} className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-900">Mark Inactive</button>
              <button type="button" onClick={() => onApplyStatus("sold-out")} className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-900">Mark Sold Out</button>
              <button type="button" onClick={() => onApplyStatus("upcoming")} className="w-full px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-900">Mark Upcoming</button>
              <div className="border-t border-gray-800" />
              <button
                type="button"
                onClick={() => {
                  onClearSelection();
                  setBulkOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left text-sm text-gray-400 hover:bg-gray-900"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowsActionBar;
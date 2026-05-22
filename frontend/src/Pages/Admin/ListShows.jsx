import { Loader2 } from "lucide-react";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import ShowsTable from "../../Components/Admin/ShowsTable/ShowsTable";
import ShowsHeader from "../../Components/Admin/ListShows/ShowsHeader";
import ShowsStats from "../../Components/Admin/ListShows/ShowsStats";
import ShowsActionBar from "../../Components/Admin/ListShows/ShowsActionBar";
import ShowsFooter from "../../Components/Admin/ListShows/ShowsFooter";
import ShowViewModal from "../../Components/Admin/ListShows/ShowViewModal";
import ShowEditModal from "../../Components/Admin/ListShows/ShowEditModal";
import { adminShowsQuickActions, adminShowsRecentActivity } from "../../assets/assets";
import useShows from "../../Components/Admin/ListShows/useShows";
import { computeStats } from "../../Components/Admin/ListShows/showsUtils";

const ListShows = () => {
  const {
    shows, loading, selectedShowIds, viewShowId, setViewShowId,
    editShowId, setEditShowId, bulkOpen, setBulkOpen,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    filteredShows, viewShow, editShow,
    handleEdit, handleDelete, handleView, handleExport,
    handleBulkDelete, applyBulkStatus, handleDuplicate, handleEditSubmit,
  } = useShows();

  const stats = computeStats(shows);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <ShowsHeader />
          <ShowsStats stats={stats} />
          <ShowsActionBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedCount={selectedShowIds.length}
            bulkOpen={bulkOpen}
            setBulkOpen={setBulkOpen}
            onAddNew={handleAddNew}
            onExport={handleExport}
            onBulkDelete={() => handleBulkDelete(selectedShowIds)}
            onApplyStatus={applyBulkStatus}
            onClearSelection={() => setSelectedShowIds([])}
          />

          <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden mb-6 lg:mb-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
              </div>
            ) : (
              <ShowsTable
                shows={filteredShows}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedIds={selectedShowIds}
                onSelectedIdsChange={(next) => {
                  setSelectedShowIds(next);
                  if (next.length === 0) setBulkOpen(false);
                }}
                onBulkDelete={handleBulkDelete}
                onDuplicate={handleDuplicate}
              />
            )}
          </div>

          <ShowsFooter quickActions={adminShowsQuickActions} recentActivity={adminShowsRecentActivity} />
        </div>
      </main>

      {bulkOpen && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setBulkOpen(false)} />
      )}

      <ShowViewModal show={viewShow} onClose={() => setViewShowId(null)} onEdit={(id) => { setViewShowId(null); setEditShowId(id); }} />

      <ShowEditModal show={editShow} onClose={() => setEditShowId(null)} onSubmit={handleEditSubmit} />
    </div>
  );
};

export default ListShows;

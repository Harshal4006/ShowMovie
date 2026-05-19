import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
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
import { getAdminShows, deleteShow } from "../../services/api";

const ListShows = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShowIds, setSelectedShowIds] = useState([]);
  const [viewShowId, setViewShowId] = useState(null);
  const [editShowId, setEditShowId] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const data = await getAdminShows(token);
        const fetchedShows = Array.isArray(data) ? data : (data?.shows || []);
        const mapped = fetchedShows.map((s) => {
          const movie = s?.movie;
          return {
            id: s?._id,
            _id: s?._id,
            movieName: movie?.title || "Unknown",
            poster: movie?.posterUrl || movie?.poster_path || "",
            poster2: movie?.backdropUrl || movie?.backdrop_path || "",
            theater: s?.theater || "",
            date: formatDate(s?.showDateTime),
            time: formatTime(s?.showDateTime),
            price: s?.showPrice || 0,
            language: movie?.language || movie?.original_language || "",
            screenType: s?.screenType || "",
            description: movie?.overview || "",
            status: s?.status || "active",
            showPrice: s?.showPrice,
            showDateTime: s?.showDateTime,
          };
        });
        setShows(mapped);
      } catch {
        toast.error("Failed to load shows");
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [getToken]);

  const viewShow = useMemo(
    () => shows.find((s) => (s._id || s.id) === viewShowId) || null,
    [shows, viewShowId]
  );
  const editShow = useMemo(
    () => shows.find((s) => (s._id || s.id) === editShowId) || null,
    [shows, editShowId]
  );

  const filteredShows = useMemo(() => {
    return shows.filter((show) => {
      const matchesSearch = !searchQuery ||
        show.movieName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.theater.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || show.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [shows, searchQuery, statusFilter]);

  const handleEdit = (show) => setEditShowId(show._id || show.id);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this show?")) return;
    try {
      const token = await getToken();
      await deleteShow(token, id);
      setShows((prev) => prev.filter((s) => (s._id || s.id) !== id));
      setSelectedShowIds((prev) => prev.filter((x) => x !== id));
      toast.success("Show deleted");
    } catch {
      toast.error("Failed to delete show");
    }
  };
  const handleView = (id) => setViewShowId(id);
  const handleAddNew = () => navigate("/admin/add-show");

  const handleExport = () => {
    const headers = ["ID", "Movie Name", "Theater", "Date", "Time", "Price", "Language", "Screen Type", "Status"];
    const csvRows = [headers.join(","),
      ...filteredShows.map(show => [
        show.id,
        `"${show.movieName}"`,
        `"${show.theater}"`,
        show.date,
        show.time,
        show.price,
        show.language,
        show.screenType,
        show.status
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shows_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Shows exported to CSV");
  };

  const handleBulkDelete = (ids) => {
    setShows((prev) => prev.filter((s) => !ids.includes(s.id)));
    setSelectedShowIds([]);
  };

  const applyBulkStatus = (status) => {
    if (selectedShowIds.length === 0) {
      toast.error("Select at least one show first");
      return;
    }
    setShows((prev) =>
      prev.map((s) => (selectedShowIds.includes(s.id) ? { ...s, status } : s))
    );
    toast.success(`Updated ${selectedShowIds.length} show(s)`);
    setBulkOpen(false);
  };

  const handleDuplicate = (show) => {
    const nextId = Math.max(0, ...shows.map((s) => s.id)) + 1;
    const duplicated = { ...show, id: nextId, movieName: `${show.movieName} (Copy)` };
    setShows((prev) => [duplicated, ...prev]);
    toast.success("Show duplicated");
  };

  const handleEditSubmit = (formData) => {
    if (!editShow) return;
    const primary = formData.showtimes?.[0] || { date: editShow.date, time: editShow.time };

    setShows((prev) =>
      prev.map((s) =>
        s.id === editShow.id
          ? {
              ...s,
              movieName: formData.movieName,
              poster: formData.poster,
              poster2: formData.poster2,
              theater: formData.theater,
              date: primary.date,
              time: primary.time,
              price: Number(formData.price),
              language: formData.language,
              screenType: formData.screenType,
              description: formData.description,
              status: formData.status,
              showtimes: formData.showtimes,
            }
          : s
      )
    );
    setEditShowId(null);
    toast.success("Show updated");
  };

  const stats = [
    { label: "Total Shows", value: shows.length, color: "text-white" },
    { label: "Active", value: shows.filter((s) => s.status === "active").length, color: "text-green-400" },
    { label: "Sold Out", value: shows.filter((s) => s.status === "sold-out").length, color: "text-red-400" },
    { label: "Upcoming", value: shows.filter((s) => s.status === "upcoming").length, color: "text-blue-400" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64">
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

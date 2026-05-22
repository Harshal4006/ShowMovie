import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { getAdminShows, deleteShow } from "../../../services/api";
import { formatDate, formatTime } from "./showsUtils";

// Hook for managing show listing, filtering, and CRUD actions
const useShows = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

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

  return {
    shows, loading, selectedShowIds, viewShowId, setViewShowId,
    editShowId, setEditShowId, bulkOpen, setBulkOpen,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    filteredShows, viewShow, editShow,
    handleEdit, handleDelete, handleView, handleAddNew, handleExport,
    handleBulkDelete, applyBulkStatus, handleDuplicate, handleEditSubmit,
  };
};

export default useShows;

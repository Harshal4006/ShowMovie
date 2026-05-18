import { useState, useMemo, useEffect } from "react";
import { IndianRupee } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import BookingsTable from "../../Components/Admin/BookingsTable/BookingsTable";
import BookingsHeader from "../../Components/Admin/ListBookings/BookingsHeader";
import BookingsStats from "../../Components/Admin/ListBookings/BookingsStats";
import BookingsActionBar from "../../Components/Admin/ListBookings/BookingsActionBar";
import BookingsInsights from "../../Components/Admin/ListBookings/BookingsInsights";
import BookingsFooter from "../../Components/Admin/ListBookings/BookingsFooter";
import BookingModal from "../../Components/Admin/ListBookings/BookingModal";
import { adminBookingsHelpActions, adminBookingsRecentNotifications } from "../../assets/assets";
import { getAdminBookings } from "../../services/api";

const ListBookings = () => {
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

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [viewBooking, setViewBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await getToken();
        const data = await getAdminBookings(token);
        const raw = Array.isArray(data) ? data : (data?.bookings || []);
        setBookings(raw.map((b, idx) => ({
          id: b._id || idx,
          bookingId: b._id ? `BK-${String(b._id).slice(-6).toUpperCase()}` : `BK-${String(idx + 1).padStart(3, "0")}`,
          userName: b.user?.name ?? "User",
          userEmail: b.user?.email ?? "N/A",
          movieName: b.show?.movie?.title ?? "Movie",
          theater: b.show?.theater || "Main Theater",
          seats: (b.bookedSeats ?? []).join(", "),
          screen: b.show?.screenType || "Screen A1",
          amount: String(b.amount ?? 0),
          tickets: (b.bookedSeats ?? []).length,
          bookingDate: formatDate(b.show?.showDateTime),
          bookingTime: formatTime(b.show?.showDateTime),
          paymentStatus: b.isPaid ? "paid" : "pending",
          paymentMethod: b.isPaid ? "UPI" : "Cash",
        })));
      } catch (e) {
        console.error("Failed to load bookings:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [getToken]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = !searchQuery ||
        booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.movieName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || booking.paymentStatus === statusFilter;
      const matchesDate = !dateFilter || booking.bookingDate === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchQuery, statusFilter, dateFilter]);

  const handleView = (id) => {
    const booking = bookings.find(b => b.id === id);
    setViewBooking(booking);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, paymentStatus: newStatus } : booking
      )
    );
  };

  const totalRevenue = filteredBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + parseFloat(b.amount), 0)
    .toFixed(2);

  const stats = [
    { label: "Total Bookings", value: bookings.length, color: "text-white" },
    { label: "Total Revenue", value: <span><IndianRupee size={18} className="inline self-center" />{totalRevenue}</span>, color: "text-green-400", note: "Paid only" },
    { label: "Pending", value: bookings.filter((b) => b.paymentStatus === "pending").length, color: "text-yellow-400" },
    { label: "Cancelled", value: bookings.filter((b) => b.paymentStatus === "cancelled").length, color: "text-red-400" },
  ];

  const handleExport = () => {
    const headers = ["Booking ID", "User", "Movie", "Seats", "Amount", "Date", "Status"];
    const rows = filteredBookings.map(b => [
      b.bookingId, b.userName, b.movieName, b.seats, b.amount, b.bookingDate, b.paymentStatus
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <BookingsHeader />
          <BookingsStats stats={stats} />
          <BookingsActionBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onExport={handleExport}
          />

          <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden mb-6 lg:mb-8">
            <BookingsTable
              bookings={filteredBookings}
              onView={handleView}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>

          <BookingsInsights />
          <BookingsFooter helpActions={adminBookingsHelpActions} notifications={adminBookingsRecentNotifications} />
        </div>
      </main>

      <BookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />
    </div>
  );
};

export default ListBookings;

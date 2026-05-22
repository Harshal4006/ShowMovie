import { useMemo, useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  IndianRupee,
  Ticket,
  Film,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import DashboardHeader from "../../Components/Admin/Dashboard/DashboardHeader";
import StatsCards from "../../Components/Admin/Dashboard/StatsCards";
import RecentBookings from "../../Components/Admin/Dashboard/RecentBookings";
import DashboardWidgets from "../../Components/Admin/Dashboard/DashboardWidgets";
import { adminShowsQuickActions, adminShowsRecentActivity } from "../../assets/assets";
import { getAdminDashboard, getAdminBookings, getAdminShows } from "../../services/api";

const Dashboard = () => {
  const { getToken } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [showsData, setShowsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const [stats, bookings, shows] = await Promise.all([
          getAdminDashboard(token),
          getAdminBookings(token),
          getAdminShows(token)
        ]);
        setStatsData(stats);
        setBookingsData(Array.isArray(bookings) ? bookings : (bookings?.bookings || []));
        setShowsData(Array.isArray(shows) ? shows : (shows?.shows || []));
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const recentBookings = useMemo(() => {
    return bookingsData.slice(0, 5).map((b, idx) => {
      const show = b.show;
      const movie = show?.movie;
      return {
        id: b._id || idx,
        user: b.user?.name ?? "User",
        movie: movie?.title ?? "Movie",
        seats: (b.bookedSeats ?? []).join(", "),
        amount: <span><IndianRupee size={14} className="inline self-center" />{b.amount}</span>,
        date: formatDate(show?.showDateTime),
        status: b.isPaid ? "Paid" : "Pending",
      };
    });
  }, [bookingsData]);

  const topMovies = useMemo(() => {
    const counts = new Map();
    for (const b of bookingsData) {
      const title = b.show?.movie?.title ?? "Movie";
      counts.set(title, (counts.get(title) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([title, count]) => ({ title, count }));
  }, [bookingsData]);

  const upcomingShows = useMemo(() => {
    const now = new Date();
    return showsData
      .filter(s => new Date(s.showDateTime) > now)
      .slice(0, 3)
      .map((s) => ({
        label: formatDate(s.showDateTime),
        screen: s.screenType || "Standard",
      }));
  }, [showsData]);

  const stats = [
    {
      title: "Total Bookings",
      value: statsData?.totalBookings || 0,
      change: "+12%",
      changeType: "positive",
      icon: Ticket,
      color: "blue",
    },
    {
      title: "Total Revenue",
      value: <span><IndianRupee size={18} className="inline self-center" />{statsData?.totalRevenue || 0}</span>,
      change: "+8%",
      changeType: "positive",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Active Shows",
      value: statsData?.activeShows || 0,
      change: "+3",
      changeType: "positive",
      icon: Film,
      color: "purple",
    },
    {
      title: "Total Users",
      value: statsData?.totalUser || 0,
      change: "+5%",
      changeType: "positive",
      icon: Users,
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-950 text-white">
        <AdminSidebar />
        <main className="flex-1 w-full lg:ml-64 pt-14 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex items-center justify-center h-96">
            <div className="text-gray-400">Loading dashboard...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <DashboardHeader />
          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <RecentBookings recentBookings={recentBookings} />
            <DashboardWidgets topMovies={topMovies} upcomingShows={upcomingShows} quickActions={adminShowsQuickActions} recentActivity={adminShowsRecentActivity} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
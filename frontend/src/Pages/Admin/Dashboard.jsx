import { useMemo } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  IndianRupee,
  Ticket,
  Film,
} from "lucide-react";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import DashboardHeader from "../../Components/Admin/Dashboard/DashboardHeader";
import StatsCards from "../../Components/Admin/Dashboard/StatsCards";
import RecentBookings from "../../Components/Admin/Dashboard/RecentBookings";
import DashboardWidgets from "../../Components/Admin/Dashboard/DashboardWidgets";
import { dummyBookingData, dummyDashboardData } from "../../assets/assets";

const Dashboard = () => {
  // helper to format iso dates to yyyy-mm-dd
  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const recentBookings = useMemo(() => {
    return dummyBookingData.slice(0, 5).map((b, idx) => ({
      id: idx + 1,
      user: b.user?.name ?? "User",
      movie: b.show?.movie?.title ?? "Movie",
      seats: (b.bookedSeats ?? []).join(", "),
      amount: <span><IndianRupee size={14} className="inline self-center" />{b.amount}</span>,
      date: formatDate(b.show?.showDateTime),
      status: b.isPaid ? "Paid" : "Pending",
    }));
  }, []);

  const topMovies = useMemo(() => {
    const counts = new Map();
    for (const b of dummyBookingData) {
      const title = b.show?.movie?.title ?? "Movie";
      counts.set(title, (counts.get(title) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([title, count]) => ({ title, count }));
  }, []);

  const upcomingShows = useMemo(() => {
    return (dummyDashboardData.activeShows ?? [])
      .slice(0, 3)
      .map((s) => ({
        label: formatDate(s.showDateTime),
        screen: "IMAX",
      }));
  }, []);

  const stats = [
    {
      title: "Total Bookings",
      value: dummyDashboardData.totalBookings || 0,
      change: "+12%",
      changeType: "positive",
      icon: Ticket,
      color: "blue",
    },
    {
      title: "Total Revenue",
      value: <span><IndianRupee size={18} className="inline self-center" />{dummyDashboardData.totalRevenue || 0}</span>,
      change: "+8%",
      changeType: "positive",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Active Shows",
      value: dummyDashboardData.activeShows?.length ?? 0,
      change: "+3",
      changeType: "positive",
      icon: Film,
      color: "purple",
    },
    {
      title: "Total Users",
      value: dummyDashboardData.totalUser || 0,
      change: "+5%",
      changeType: "positive",
      icon: Users,
      color: "orange",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <DashboardHeader />
          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <RecentBookings recentBookings={recentBookings} />
            <DashboardWidgets topMovies={topMovies} upcomingShows={upcomingShows} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
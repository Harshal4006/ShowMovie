import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import StatsSection from "../../Components/MyBooking/StatsSection.jsx";
import FilterTabs from "../../Components/MyBooking/FilterTabs.jsx";
import BookingsGrid from "../../Components/MyBooking/BookingsGrid.jsx";
import EmptyState from "../../Components/MyBooking/EmptyState.jsx";
import HelpSection from "../../Components/MyBooking/HelpSection.jsx";
import { BookingCardSkeleton } from "../../Components/Skeletons";
import { getMyBookings } from "../../services/api";

const MyBooking = () => {
  const { getToken, isSignedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!isSignedIn) {
          setBookings([]);
          return;
        }
        const token = await getToken();
        const data = await getMyBookings(token);
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load bookings");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [getToken, isSignedIn]);

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "paid") return booking.isPaid;
    if (filter === "pending") return !booking.isPaid;
    return true;
  }), [bookings, filter]);

  const totalBookings = bookings.length;
  const paidBookings = bookings.filter((b) => b.isPaid).length;
  const pendingBookings = bookings.filter((b) => !b.isPaid).length;
  const totalAmount = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  return (
    <section className="w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            View and manage your movie bookings, past and upcoming.
          </p>
        </div>

        {/* Stats */}
        <StatsSection
          totalBookings={totalBookings}
          paidBookings={paidBookings}
          pendingBookings={pendingBookings}
          totalAmount={totalAmount}
        />

        {/* Filter Tabs */}
        <FilterTabs currentFilter={filter} onFilterChange={setFilter} />

        {/* Bookings Grid or Empty State */}
        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-gray-200">
            <h2 className="text-xl font-semibold text-white">Couldn’t load bookings</h2>
            <p className="mt-2 text-sm text-gray-400">{error}</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <BookingsGrid bookings={filteredBookings} />
        ) : (
          <EmptyState filter={filter} />
        )}

        {/* Help Section */}
        <HelpSection />
      </div>
    </section>
  );
};

export default MyBooking;

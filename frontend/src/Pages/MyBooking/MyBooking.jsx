import React, { useState, useEffect } from "react";
import { dummyBookingData } from "../../assets/assets.js";
import StatsSection from "../../Components/MyBooking/StatsSection.jsx";
import FilterTabs from "../../Components/MyBooking/FilterTabs.jsx";
import BookingsGrid from "../../Components/MyBooking/BookingsGrid.jsx";
import EmptyState from "../../Components/MyBooking/EmptyState.jsx";
import HelpSection from "../../Components/MyBooking/HelpSection.jsx";
import { BookingCardSkeleton } from "../../Components/Skeletons";

const MyBooking = () => {
  const [bookings] = useState(() => dummyBookingData);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "paid") return booking.isPaid;
    if (filter === "pending") return !booking.isPaid;
    return true;
  });

  const totalBookings = bookings.length;
  const paidBookings = bookings.filter((b) => b.isPaid).length;
  const pendingBookings = bookings.filter((b) => !b.isPaid).length;
  const totalAmount = bookings.reduce((sum, b) => sum + b.amount, 0);

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

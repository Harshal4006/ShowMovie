import React from "react";
import BookingCard from "../BookingCard/BookingCard.jsx";

const BookingsGrid = ({ bookings }) => {
  if (!bookings.length) return null;

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
};

export default BookingsGrid;
import BookingCard from "../BookingCard/BookingCard.jsx";

const BookingsGrid = ({ bookings }) => {
  if (!bookings.length) return null;

  return (
    <div className="mt-8 flex flex-col gap-4">
      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
};

export default BookingsGrid;
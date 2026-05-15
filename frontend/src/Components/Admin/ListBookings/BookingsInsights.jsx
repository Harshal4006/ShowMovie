import BookingTrends from "./BookingTrends";
import PaymentMethods from "./PaymentMethods";

const BookingsInsights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <BookingTrends />
      <PaymentMethods />
    </div>
  );
};

export default BookingsInsights;
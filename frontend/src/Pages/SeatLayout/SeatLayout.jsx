import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

import ShowTimingsCard from "../../Components/SeatLayout/cards/ShowTimingsCard.jsx";
import LoadingState from "../../Components/SeatLayout/states/LoadingState.jsx";
import ErrorState from "../../Components/SeatLayout/states/ErrorState.jsx";
import SeatSelectionCard from "../../Components/SeatLayout/cards/SeatSelectionCard.jsx";
import SeatSummaryCard from "../../Components/SeatLayout/cards/SeatSummaryCard.jsx";
import BookingConfirmationModal from "../../Components/SeatLayout/modals/BookingConfirmationModal.jsx";
import QuickBookingSuggestions from "../../Components/SeatLayout/cards/QuickBookingSuggestions.jsx";
import { useSeatLayoutModel } from "../../Components/SeatLayout/hooks/useSeatLayoutModel.js";
import useSeatLayoutPayment from "../../Components/SeatLayout/hooks/useSeatLayoutPayment.js";

const SeatLayout = () => {
  const navigate = useNavigate();
  const { id, date } = useParams();
  const [searchParams] = useSearchParams();
  const time = searchParams.get("time") || "";
  const { isSignedIn, getToken } = useAuth();

  const {
    status,
    errorMessage,
    movie,
    rows,
    seatsPerRow,
    selectedShow,
    occupiedSeats,
    selectedSeats,
    selectedSeatsSet,
    subtotal,
    toggleSeat,
    selectMultipleSeats,
  } = useSeatLayoutModel({ id, date, time });

  const {
    showConfirmationModal,
    isProcessing,
    totalAmount,
    handleToggleSeat,
    handleConfirmClick,
    handleConfirmBooking,
    handleCloseModal,
    handleSuggestionSelect,
  } = useSeatLayoutPayment({
    selectedSeats,
    selectedShow,
    movie,
    subtotal,
    toggleSeat,
    selectMultipleSeats,
    isSignedIn,
    getToken,
  });

  return (
    <section className="relative w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <Link
          to={movie ? `/movies/${movie.id ?? movie._id}` : "/movies"}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        {status === "loading" && <LoadingState />}

        {status === "error" && (
          <ErrorState
            title="Unable to load seat layout"
            message={errorMessage || "Something went wrong."}
            actionLabel="Go to movies"
            onAction={() => navigate("/movies")}
          />
        )}

        {status === "ready" && movie && (
          <div className="grid gap-6 md:gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <ShowTimingsCard
                movie={movie}
                date={date}
                time={time}
                showPrice={selectedShow?.showPrice}
              />

              <SeatSelectionCard
                rows={rows}
                seatsPerRow={seatsPerRow}
                occupiedSeats={occupiedSeats}
                selectedSeats={selectedSeatsSet}
                onToggleSeat={handleToggleSeat}
              />

              <QuickBookingSuggestions
                rows={rows}
                seatsPerRow={seatsPerRow}
                occupiedSeats={occupiedSeats}
                onSelectSuggestion={handleSuggestionSelect}
              />
            </div>

            <aside className="lg:col-span-4">
              <SeatSummaryCard
                date={date}
                time={time}
                selectedSeats={selectedSeats}
                subtotal={subtotal}
                showPrice={selectedShow?.showPrice}
                onConfirm={handleConfirmClick}
                confirmDisabled={selectedSeats.length === 0}
                movie={movie}
              />
            </aside>
          </div>
        )}
      </div>

      <BookingConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBooking}
        isLoading={isProcessing}
        total={totalAmount}
        bookingDetails={{
          movieTitle: movie?.title,
          showDate: date,
          showTime: time,
          seats: selectedSeats,
          subtotal,
          showPrice: selectedShow?.showPrice || 180,
          theater: selectedShow?.theater || "Standard Theater",
        }}
      />
    </section>
  );
};

export default SeatLayout;

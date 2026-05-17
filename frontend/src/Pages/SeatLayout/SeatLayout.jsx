import React, { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

import ShowTimingsCard from "../../Components/SeatLayout/ShowTimingsCard.jsx";
import LoadingState from "../../Components/SeatLayout/LoadingState.jsx";
import ErrorState from "../../Components/SeatLayout/ErrorState.jsx";
import SeatSelectionCard from "../../Components/SeatLayout/SeatSelectionCard.jsx";
import SeatSummaryCard from "../../Components/SeatLayout/SeatSummaryCard.jsx";
import BookingConfirmationModal from "../../Components/SeatLayout/BookingConfirmationModal.jsx";
import QuickBookingSuggestions from "../../Components/SeatLayout/QuickBookingSuggestions.jsx";
import { useSeatLayoutModel } from "../../Components/SeatLayout/useSeatLayoutModel.js";
import { createBooking } from "../../services/api";

const SeatLayout = () => {
  const navigate = useNavigate();
  const { id, date } = useParams();
  const [searchParams] = useSearchParams();
  const time = searchParams.get("time") || "";
  const { isSignedIn, getToken } = useAuth();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // block UI while processing booking

  const {
    status,
    errorMessage,
    isResolving,
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

  const handleToggleSeat = (seatId) => {
    const result = toggleSeat(seatId);
    if (result.reason === "limit") {
      toast.error("You can select up to 8 seats.");
    } else if (result.ok) {
      // Optional: Play subtle sound or show visual feedback
    }
  };

  // open confirmation modal if seats are selected
  const handleConfirmClick = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to continue.");
      return;
    }
    setShowConfirmationModal(true);
  };

  // finalize the booking and redirect
  const handleConfirmBooking = async () => {
    if (!selectedShow?._id) {
      toast.error("Show not found for selected date/time.");
      return;
    }
    if (!isSignedIn) {
      toast.error("Please sign in to book tickets.");
      return;
    }

    setIsProcessing(true);
    try {
      const token = await getToken();
      await createBooking(token, {
        showId: selectedShow._id,
        bookedSeats: selectedSeats,
        amount: subtotal,
      });

      setShowConfirmationModal(false);
      toast.success("Booking confirmed! Redirecting to your bookings...");
      navigate("/my-booking");
    } catch (e) {
      toast.error(e?.message || "Failed to confirm booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    if (!isProcessing) {
      setShowConfirmationModal(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const result = selectMultipleSeats(suggestion.seats);
    if (!result.ok) {
      toast.error(result.reason === "limit"
        ? "Cannot select all suggested seats. Some are already occupied or exceed seat limit."
        : "Unable to select suggested seats.");
      return;
    }
    
    toast.success(`Selected ${suggestion.seats.length} seats: ${suggestion.seats.join(", ")}`);
  };

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

        {(status === "loading" || isResolving) && <LoadingState />}

        {!isResolving && status === "error" && (
          <ErrorState
            title="Unable to load seat layout"
            message={errorMessage || "Something went wrong."}
            actionLabel="Go to movies"
            onAction={() => navigate("/movies")}
          />
        )}

        {!isResolving && status === "ready" && movie && (
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

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBooking}
        isLoading={isProcessing}
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

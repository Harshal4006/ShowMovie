import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createPaymentOrder, verifyPayment } from "../../../services/api";

// Handles payment flow, confirmation modal, and Razorpay integration
const useSeatLayoutPayment = ({
  selectedSeats = [],
  selectedShow,
  movie,
  subtotal = 0,
  toggleSeat,
  selectMultipleSeats,
  isSignedIn,
  getToken,
}) => {
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const convenienceFee = 2.99;
  const tax = subtotal * 0.08;
  const totalAmount = useMemo(
    () => subtotal + convenienceFee + tax,
    [subtotal]
  );

  const handleToggleSeat = useCallback((seatId) => {
    const result = toggleSeat(seatId);
    if (result?.reason === "limit") {
      toast.error("You can select up to 8 seats.");
    }
  }, [toggleSeat]);

  const handleConfirmClick = useCallback(() => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to continue.");
      return;
    }
    setShowConfirmationModal(true);
  }, [selectedSeats]);

  const handlePaymentSuccess = useCallback(async (response) => {
    try {
      const token = await getToken();
      await verifyPayment(token, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        showId: selectedShow._id,
        bookedSeats: selectedSeats,
        amount: totalAmount,
      });

      setShowConfirmationModal(false);
      toast.success("Payment successful! Booking confirmed.");
      navigate("/my-booking");
    } catch (error) {
      toast.error(error?.message || "Payment verification failed. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  }, [getToken, selectedShow, selectedSeats, totalAmount, navigate]);

  const handlePaymentError = useCallback(() => {
    setIsProcessing(false);
    toast.error("Payment failed. Please try again.");
  }, []);

  const handleConfirmBooking = useCallback(async () => {
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

      const orderResponse = await createPaymentOrder(token, {
        amount: totalAmount,
        currency: "INR",
        receipt: `showmovie_${Date.now()}`,
      });

      if (!orderResponse.success || !orderResponse.orderId) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "ShowMovie",
        description: `Booking for ${movie?.title || "Movie"}`,
        order_id: orderResponse.orderId,
        handler: handlePaymentSuccess,
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#ef4444" },
        modal: {
          ondismiss: () => { setIsProcessing(false); },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", handlePaymentError);
      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      toast.error(error?.message || "Failed to initiate payment. Please try again.");
    }
  }, [selectedShow, isSignedIn, getToken, totalAmount, movie, handlePaymentSuccess, handlePaymentError]);

  const handleCloseModal = useCallback(() => {
    if (!isProcessing) {
      setShowConfirmationModal(false);
    }
  }, [isProcessing]);

  const handleSuggestionSelect = useCallback((suggestion) => {
    const result = selectMultipleSeats(suggestion.seats);
    if (!result.ok) {
      toast.error(
        result.reason === "limit"
          ? "Cannot select all suggested seats. Some are already occupied or exceed seat limit."
          : "Unable to select suggested seats."
      );
      return;
    }
    toast.success(`Selected ${suggestion.seats.length} seats: ${suggestion.seats.join(", ")}`);
  }, [selectMultipleSeats]);

  return {
    showConfirmationModal,
    isProcessing,
    totalAmount,
    handleToggleSeat,
    handleConfirmClick,
    handleConfirmBooking,
    handleCloseModal,
    handleSuggestionSelect,
  };
};

export default useSeatLayoutPayment;

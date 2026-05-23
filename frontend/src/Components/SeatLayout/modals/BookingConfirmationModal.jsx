import { X, CheckCircle, IndianRupee } from 'lucide-react';
import MovieInfoCard from './MovieInfoCard';
import SeatsCard from './SeatsCard';
import PaymentSummaryCard from './PaymentSummaryCard';
import ImportantInfoCard from './ImportantInfoCard';

const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  isLoading = false,
  total: totalProp,
}) => {
  if (!isOpen) return null;

  const {
    movieTitle = 'Spider-Man: Brand New Day',
    showDate = 'Sat, Aug 1, 2026',
    showTime = '10:30 PM',
    seats = ['C10', 'B10'],
    subtotal = 118,
    showPrice = 59,
    theater = 'Standard Theater',
  } = bookingDetails || {};

  const totalSeats = seats.length;
  const convenienceFee = 2.99;
  const tax = subtotal * 0.08;
  const total = totalProp ?? (subtotal + convenienceFee + tax);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm animate-fade-in [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-300" />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h2 id="modal-title" className="text-3xl font-bold text-white mb-2">
              Confirm Your <span className="text-red-500">Booking</span>
            </h2>
            <p className="text-gray-400">Please review your booking details before proceeding</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <MovieInfoCard
                movieTitle={movieTitle}
                showDate={showDate}
                showTime={showTime}
                theater={theater}
              />

              <SeatsCard seats={seats} />
            </div>

            <div className="space-y-6">
              <PaymentSummaryCard
                totalSeats={totalSeats}
                showPrice={showPrice}
                subtotal={subtotal}
                convenienceFee={convenienceFee}
                tax={tax}
                total={total}
                rupeeSize={14}
                totalRupeeSize={21}
              />

              <ImportantInfoCard />

              <div className="space-y-4 mt-8">
                <button
                  onClick={onConfirm}
                  disabled={isLoading || totalSeats === 0}
                  className="group relative w-full h-14 md:h-16 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-[length:200%_100%] text-white font-bold text-sm md:text-lg shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.12)_50%,transparent_70%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/15 inset-ring-1 inset-ring-white/20 pointer-events-none" />
                  {isLoading ? (
                    <span className="relative z-10 flex items-center justify-center gap-3 px-4 md:px-8">
                      <div className="w-5 h-5 md:w-6 md:h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm md:text-lg">Processing...</span>
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center justify-center md:justify-between gap-2 md:gap-0 px-4 md:px-8 whitespace-nowrap">
                      <span className="flex items-center gap-2 md:gap-3">
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                        <span className="hidden md:inline">Confirm &</span>
                        <span>Pay</span>
                      </span>
                      <span className="flex items-baseline gap-1">
                        <IndianRupee className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                        <span className="text-lg md:text-2xl font-bold tracking-tight">{total.toFixed(2)}</span>
                      </span>
                    </span>
                  )}
                </button>

                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-xl border-2 border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <p className="text-xs text-center text-gray-500 pt-2">
                  By confirming, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">
              Need help? Contact our support team at support@showmovie.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;

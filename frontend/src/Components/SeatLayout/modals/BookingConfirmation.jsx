import { CheckCircle, IndianRupee } from 'lucide-react';
import MovieInfoCard from './MovieInfoCard';
import SeatsCard from './SeatsCard';
import PaymentSummaryCard from './PaymentSummaryCard';
import ImportantInfoCard from './ImportantInfoCard';

const BookingConfirmation = ({
  movieTitle = 'Spider-Man: Brand New Day',
  showDate = 'Sat, Aug 1, 2026',
  showTime = '10:30 PM',
  theater = 'Standard Theater',
  seats = ['C10', 'B10'],
  showPrice = 59,
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  const totalSeats = seats.length;
  const subtotal = totalSeats * showPrice;
  const convenienceFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + convenienceFee + tax;

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4 md:p-8 flex items-center justify-center overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="w-full max-w-2xl overflow-hidden">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Booking <span className="text-red-500">Confirmation</span>
          </h1>
          <p className="text-gray-400 text-lg">Review your booking details before proceeding</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MovieInfoCard
              movieTitle={movieTitle}
              showDate={showDate}
              showTime={showTime}
              theater={theater}
              showTicketIcon
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
              totalRupeeSize={14}
            />

            <ImportantInfoCard />

            <div className="space-y-4">
              <button
                onClick={onConfirm}
                disabled={isLoading || totalSeats === 0}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-red-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Confirm & Pay <IndianRupee size={14} className="inline self-center" />{total.toFixed(2)}
                  </>
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl border-2 border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                Cancel Booking
              </button>

              <p className="text-xs text-center text-gray-500 pt-2">
                By confirming, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at support@showmovie.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

import React from 'react';
import { X, CheckCircle, AlertCircle, Calendar, Clock, MapPin, Ticket, Shield, ChevronRight, IndianRupee } from 'lucide-react';

// Booking Confirmation Modal
 
const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  isLoading = false,
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Sat, Aug 1, 2026';
    return dateString;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '10:30 PM';
    return timeString;
  };

  // Calculate payment breakdown
  const totalSeats = seats.length;
  const convenienceFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + convenienceFee + tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm animate-fade-in [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-300" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 id="modal-title" className="text-3xl font-bold text-white mb-2">
              Confirm Your <span className="text-red-500">Booking</span>
            </h2>
            <p className="text-gray-400">Please review your booking details before proceeding</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Booking Details */}
            <div className="space-y-6">
              {/* Movie Info Card */}
              <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{movieTitle}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20">
                          <Calendar className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="text-white font-medium">{formatDate(showDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20">
                          <Clock className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Time</p>
                          <p className="text-white font-medium">{formatTime(showTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20">
                          <MapPin className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Theater</p>
                          <p className="text-white font-medium">{theater}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats Selection */}
              <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-red-400" />
                    Selected Seats
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300">
                    {totalSeats} seats
                  </span>
                </div>
                
                {/* Show selected seats or empty state */}
                {totalSeats > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                    {seats.map((seat, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-[#0f1117] border border-white/10 flex items-center justify-center group hover:border-red-500/50 transition-all duration-300"
                      >
                        <span className="text-xl font-bold text-white">{seat}</span>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center py-4">No seats selected</p>
                )}
                
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm">
                    Your seats are reserved for the next 15 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Payment & Actions */}
            <div className="space-y-6">
              {/* Price Breakdown */}
              <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  Payment Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tickets ({totalSeats} × <IndianRupee size={14} className="inline self-center" />{showPrice})</span>
                    <span className="text-white font-semibold"><IndianRupee size={14} className="inline self-center" />{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Convenience Fee</span>
                    <span className="text-white font-semibold"><IndianRupee size={14} className="inline self-center" />{convenienceFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tax (8%)</span>
                    <span className="text-white font-semibold"><IndianRupee size={14} className="inline self-center" />{tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-lg font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-red-400"><IndianRupee size={21} className="inline self-center" />{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="rounded-[1.9rem] border border-red-500/20 bg-red-500/5 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Important Information</h3>
                    <ul className="space-y-2 text-sm text-red-300/80">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Tickets are non-refundable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Arrive at least 15 minutes before showtime</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Present booking confirmation at the counter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Seats will be released 10 minutes after showtime</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                      Confirm & Pay<IndianRupee size={14} className="inline self-center" />{total.toFixed(2)}
                    </>
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

          {/* Footer Note */}
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
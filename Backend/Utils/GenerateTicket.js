// Utility kept for reference - not currently imported

// Create a structured ticket object from booking data
const GenerateTicket = (booking) => {
  const ticket = {
    ticketId: booking._id,
    movieTitle: booking.show?.movie?.title || 'Movie',
    showDate: new Date(booking.show?.showDateTime).toLocaleDateString('en-IN'),
    showTime: new Date(booking.show?.showDateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    theater: booking.show?.theater || 'Theater',
    seats: booking.bookedSeats,
    totalAmount: booking.amount,
    userName: booking.user?.name || 'User',
    bookingDate: new Date(booking.createdAt).toLocaleDateString('en-IN'),
    status: booking.status,
    qrCode: `TICKET-${booking._id}`
  };

  return ticket;
};

module.exports = GenerateTicket;
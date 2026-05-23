const Booking = require('../Models/Booking');
const Show = require('../Models/Show');

// Service kept for reference - not currently imported
class BookingService {
  // Check which requested seats are already occupied
  async CheckSeatAvailability(showId, seats) {
    const show = await Show.findById(showId);
    if (!show) return { available: false, reason: 'Show not found' };

    const occupiedSeats = show.occupiedSeats || new Map();
    const unavailable = [];

    for (const seat of seats) {
      if (occupiedSeats.has(seat)) {
        unavailable.push(seat);
      }
    }

    if (unavailable.length > 0) {
      return { available: false, unavailable };
    }

    return { available: true };
  }

  // Reserve seats for a user, throwing if any seat is taken
  async BookSeats(showId, seats, userId) {
    const show = await Show.findById(showId);
    if (!show) throw new Error('Show not found');

    const occupiedSeats = new Map(show.occupiedSeats);
    for (const seat of seats) {
      if (occupiedSeats.has(seat)) {
        throw new Error(`Seat ${seat} is already booked`);
      }
      occupiedSeats.set(seat, userId);
    }

    await Show.findByIdAndUpdate(showId, { occupiedSeats });
    return true;
  }

  // Free up previously reserved seats
  async ReleaseSeats(showId, seats) {
    const show = await Show.findById(showId);
    if (!show) return;

    const occupiedSeats = new Map(show.occupiedSeats);
    for (const seat of seats) {
      occupiedSeats.delete(seat);
    }

    await Show.findByIdAndUpdate(showId, { occupiedSeats });
  }

  // Retrieve all bookings made by a specific user
  async GetUserBookingHistory(userId) {
    return await Booking.find({ user: userId })
      .populate('show')
      .sort({ createdAt: -1 });
  }
}

module.exports = new BookingService();
const Booking = require('../Models/Booking');
const Show = require('../Models/Show');

const CreateBooking = async (req, res) => {
  try {
    const { showId, bookedSeats, amount } = req.body;
    const userId = req.user.id;

    // Check seat availability
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    const occupiedSeats = show.occupiedSeats || new Map();
    for (const seat of bookedSeats) {
      if (occupiedSeats.has(seat)) {
        return res.status(400).json({ message: `Seat ${seat} is already booked` });
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      bookedSeats,
      amount,
      isPaid: false
    });

    // Update show occupied seats
    const newOccupied = new Map(occupiedSeats);
    for (const seat of bookedSeats) {
      newOccupied.set(seat, userId);
    }
    await Show.findByIdAndUpdate(showId, { occupiedSeats: newOccupied });

    const populated = await Booking.findById(booking._id)
      .populate('show')
      .populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId })
      .populate('show')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('show')
      .populate('user', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only allow user or admin to view
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { CreateBooking, GetUserBookings, GetBookingById };
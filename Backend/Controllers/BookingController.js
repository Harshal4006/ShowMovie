const { getAuth } = require('@clerk/express');
const Booking = require('../Models/Booking');
const Show = require('../Models/Show');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { CreateNotification } = require('./NotificationController');

const CreateBooking = async (req, res) => {
  try {
    await ensureDbConnection();
    const { showId, bookedSeats, amount } = req.body;
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found. Please sign in again.' });

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    const occupiedSeats = show.occupiedSeats || new Map();
    for (const seat of bookedSeats) {
      if (occupiedSeats.has(seat)) {
        return res.status(400).json({ message: `Seat ${seat} is already booked` });
      }
    }

    const booking = await Booking.create({
      user: user._id,
      show: showId,
      bookedSeats,
      amount,
      isPaid: false
    });

    const newOccupied = new Map(occupiedSeats);
    for (const seat of bookedSeats) {
      newOccupied.set(seat, user._id.toString());
    }
    await Show.findByIdAndUpdate(showId, { occupiedSeats: newOccupied });

    const populated = await Booking.findById(booking._id)
      .populate('show')
      .populate('user', 'name email');

    await User.findByIdAndUpdate(user._id, { $addToSet: { bookings: booking._id } });

    await CreateNotification(
      user._id,
      'booking_confirmed',
      'Booking Confirmed!',
      `Your booking for ${bookedSeats.length} seat(s) has been confirmed.`,
      booking._id,
      'Booking'
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetUserBookings = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json([]);

    const bookings = await Booking.find({ user: user._id })
      .populate('show')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetBookingById = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const booking = await Booking.findById(req.params.id)
      .populate('show')
      .populate('user', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (booking.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { CreateBooking, GetUserBookings, GetBookingById };
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
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' }
      })
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

    const enriched = {
      _id: populated._id,
      bookedSeats: populated.bookedSeats,
      amount: populated.amount,
      isPaid: populated.isPaid,
      status: populated.status,
      createdAt: populated.createdAt,
      show: populated.show ? {
        _id: populated.show._id,
        showDateTime: populated.show.showDateTime,
        showPrice: populated.show.showPrice,
        theater: populated.show.theater,
        screenType: populated.show.screenType,
        language: populated.show.language,
        movie: populated.show.movie ? {
          _id: populated.show.movie._id,
          tmdbId: populated.show.movie.tmdbId,
          title: populated.show.movie.title,
          posterPath: populated.show.movie.posterPath,
          backdropPath: populated.show.movie.backdropPath,
          posterUrl: populated.show.movie.posterUrl,
          backdropUrl: populated.show.movie.backdropUrl,
          releaseDate: populated.show.movie.releaseDate,
          runtime: populated.show.movie.runtime,
          genres: populated.show.movie.genres,
          rating: populated.show.movie.rating,
          language: populated.show.movie.language,
          status: populated.show.movie.status
        } : null
      } : null
    };

    res.status(201).json(enriched);
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
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          model: 'Movie'
        }
      })
      .sort({ createdAt: -1 });

    const enriched = bookings.map((booking) => ({
      _id: booking._id,
      bookedSeats: booking.bookedSeats,
      amount: booking.amount,
      isPaid: booking.isPaid,
      paymentId: booking.paymentId,
      status: booking.status,
      createdAt: booking.createdAt,
      show: booking.show ? {
        _id: booking.show._id,
        showDateTime: booking.show.showDateTime,
        showPrice: booking.show.showPrice,
        theater: booking.show.theater,
        screenType: booking.show.screenType,
        language: booking.show.language,
        movie: booking.show.movie ? {
          _id: booking.show.movie._id,
          tmdbId: booking.show.movie.tmdbId,
          title: booking.show.movie.title,
          originalTitle: booking.show.movie.originalTitle,
          overview: booking.show.movie.overview,
          posterPath: booking.show.movie.posterPath,
          backdropPath: booking.show.movie.backdropPath,
          posterUrl: booking.show.movie.posterUrl,
          backdropUrl: booking.show.movie.backdropUrl,
          releaseDate: booking.show.movie.releaseDate,
          runtime: booking.show.movie.runtime,
          genres: booking.show.movie.genres,
          rating: booking.show.movie.rating,
          voteCount: booking.show.movie.voteCount,
          language: booking.show.movie.language,
          tagline: booking.show.movie.tagline,
          status: booking.show.movie.status,
          movieLanguage: booking.show.movie.movieLanguage,
          format: booking.show.movie.format
        } : null
      } : null
    }));

    res.json(enriched);
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
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' }
      })
      .populate('user', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (booking.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enriched = {
      _id: booking._id,
      bookedSeats: booking.bookedSeats,
      amount: booking.amount,
      isPaid: booking.isPaid,
      paymentId: booking.paymentId,
      status: booking.status,
      createdAt: booking.createdAt,
      show: booking.show ? {
        _id: booking.show._id,
        showDateTime: booking.show.showDateTime,
        showPrice: booking.show.showPrice,
        theater: booking.show.theater,
        screenType: booking.show.screenType,
        language: booking.show.language,
        movie: booking.show.movie ? {
          _id: booking.show.movie._id,
          tmdbId: booking.show.movie.tmdbId,
          title: booking.show.movie.title,
          posterPath: booking.show.movie.posterPath,
          backdropPath: booking.show.movie.backdropPath,
          posterUrl: booking.show.movie.posterUrl,
          backdropUrl: booking.show.movie.backdropUrl,
          releaseDate: booking.show.movie.releaseDate,
          runtime: booking.show.movie.runtime,
          genres: booking.show.movie.genres,
          rating: booking.show.movie.rating,
          language: booking.show.movie.language,
          status: booking.show.movie.status
        } : null
      } : null
    };

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { CreateBooking, GetUserBookings, GetBookingById };
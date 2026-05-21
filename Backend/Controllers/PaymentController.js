const { getAuth } = require('@clerk/express');
const razorpayInstance = require('../Config/Razorpay');
const Booking = require('../Models/Booking');
const Show = require('../Models/Show');
const User = require('../Models/User');
const ensureDbConnection = require('../Utils/ensureDbConnection');
const { CreateNotification } = require('./NotificationController');

const CreateOrder = async (req, res) => {
  try {
    await ensureDbConnection();
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create Razorpay order',
    });
  }
};

const VerifyPayment = async (req, res) => {
  try {
    await ensureDbConnection();
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      showId,
      bookedSeats,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    const crypto = require('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign in again.' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

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
      isPaid: true,
      paymentId: razorpay_payment_id,
      paymentMethod: 'razorpay',
      status: 'confirmed',
    });

    const newOccupied = new Map(occupiedSeats);
    for (const seat of bookedSeats) {
      newOccupied.set(seat, user._id.toString());
    }
    await Show.findByIdAndUpdate(showId, { occupiedSeats: newOccupied });

    const populated = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' },
      })
      .populate('user', 'name email');

    await User.findByIdAndUpdate(user._id, { $addToSet: { bookings: booking._id } });

    await CreateNotification(
      user._id,
      'payment_success',
      'Payment Successful!',
      `Your payment of ₹${amount} for ${bookedSeats.length} seat(s) has been confirmed.`,
      booking._id,
      'Booking'
    );

    const enriched = {
      _id: populated._id,
      bookedSeats: populated.bookedSeats,
      amount: populated.amount,
      isPaid: populated.isPaid,
      paymentId: populated.paymentId,
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
          status: populated.show.movie.status,
        } : null,
      } : null,
    };

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed',
      booking: enriched,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

module.exports = { CreateOrder, VerifyPayment };

const Movie = require('../Models/Movie');
const Show = require('../Models/Show');
const Booking = require('../Models/Booking');
const User = require('../Models/User');

// Dashboard Stats
const GetDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const activeShows = await Show.find({ status: 'active' }).populate('movie');
    const totalUsers = await User.countDocuments();

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeShows: activeShows.length,
      totalUser: totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Show
const CreateShow = async (req, res) => {
  try {
    const { movieId, showDateTime, showPrice, theater, screenType, language } = req.body;

    const show = await Show.create({
      movie: movieId,
      showDateTime,
      showPrice,
      theater,
      screenType,
      language,
      status: 'active'
    });

    const populated = await Show.findById(show._id).populate('movie');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Show
const UpdateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('movie');

    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Show
const DeleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings (Admin)
const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('show')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Movies (Admin)
const GetAllMoviesAdmin = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Movie
const CreateMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetDashboardStats,
  CreateShow,
  UpdateShow,
  DeleteShow,
  GetAllBookings,
  GetAllMoviesAdmin,
  CreateMovie
};
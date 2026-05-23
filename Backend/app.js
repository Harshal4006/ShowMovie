// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { serve } = require('inngest/express');
const { clerkMiddleware, getAuth } = require('@clerk/express');

const ErrorHandler = require('./Middleware/ErrorMiddleware');
const { inngest, functions } = require('./Inngest/Inngest');
const ensureDbConnection = require('./Utils/ensureDbConnection');

const app = express();

// Security headers
app.use(helmet());

// CORS - MUST be before all routes
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://showmovie-frontend.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting - general API limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// Strict rate limiters for sensitive routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts. Please try again later.' },
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment attempts. Please try again later.' },
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many booking requests. Please try again later.' },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk auth middleware - MUST be before routes
app.use(clerkMiddleware());

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShowMovie API running'
  });
});

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await ensureDbConnection();
    }

    res.json({
      status: 'ok',
      db: 'connected',
      hasMongoUri: !!process.env.MONGO_URI,
      mongoState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({
      status: 'degraded',
      db: 'disconnected',
      hasMongoUri: !!process.env.MONGO_URI,
      mongoState: mongoose.connection.readyState,
      error: error.message
    });
  }
});

// Test database endpoint (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/test-db', async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        await ensureDbConnection();
      }

      const User = require('./Models/User');
      const count = await User.countDocuments();

      res.json({
        success: true,
        userCount: count
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });
}

// Mount Inngest handler
app.use('/api/inngest', serve({ client: inngest, functions }));

// Mount TMDB routes
const TMDBRoutes = require('./Routes/TMDBRoutes');
app.use('/api/tmdb', TMDBRoutes);

// Mount Movie routes
const MovieRoutes = require('./Routes/MovieRoutes');
app.use('/api/movies', MovieRoutes);

// Mount Show routes
const ShowRoutes = require('./Routes/ShowRoutes');
app.use('/api/shows', ShowRoutes);

// Mount Booking routes
const BookingRoutes = require('./Routes/BookingRoutes');
app.use('/api/bookings', bookingLimiter, BookingRoutes);

// Mount Auth routes
const AuthRoutes = require('./Routes/AuthRoutes');
app.use('/api/auth', authLimiter, AuthRoutes);

// Mount User routes
const UserRoutes = require('./Routes/UserRoutes');
app.use('/api/users', UserRoutes);

// Mount Notification routes
const NotificationRoutes = require('./Routes/NotificationRoutes');
app.use('/api/notifications', NotificationRoutes);

// Mount Theater routes
const TheaterRoutes = require('./Routes/TheaterRoutes');
app.use('/api/theaters', TheaterRoutes);

// Mount Admin routes
const AdminRoutes = require('./Routes/AdminRoutes');
app.use('/api/admin', AdminRoutes);

// Mount Payment routes
const PaymentRoutes = require('./Routes/PaymentRoutes');
app.use('/api/payment', paymentLimiter, PaymentRoutes);

// Error handling
app.use(ErrorHandler);

// Export for Vercel
module.exports = app;

// Start server locally (not needed on Vercel)
if (require.main === module && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to MongoDB on startup
    await ensureDbConnection();
  });
}

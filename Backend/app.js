// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { serve } = require('inngest/express');
const { clerkMiddleware, getAuth } = require('@clerk/express');

const ErrorHandler = require('./Middleware/ErrorMiddleware');
const { inngest, functions } = require('./Inngest/Inngest');
const ensureDbConnection = require('./Utils/ensureDbConnection');

const app = express();

// Configure CORS
const allowedOrigin = process.env.FRONTEND_URL;
const corsOptions = {
  origin: allowedOrigin || '*',
  credentials: Boolean(allowedOrigin),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk auth middleware - MUST be before routes
app.use(clerkMiddleware());

// Debug auth route - test if token is being decoded correctly
app.get('/api/debug-auth', (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('[Debug] Request headers:', req.headers);
  console.log('[Debug] Auth header:', authHeader ? 'Present' : 'Missing');
  console.log('[Debug] Cookie header:', req.headers.cookie ? 'Present' : 'Missing');
  
  try {
    const auth = getAuth(req);
    console.log('[Debug] getAuth result:', auth);
    
    res.json({
      success: true,
      message: 'Auth debug endpoint',
      auth: {
        userId: auth.userId || null,
        sessionId: auth.sessionId || null,
        organizationId: auth.organizationId || null,
      },
      headers: {
        authHeaderPresent: !!authHeader,
        cookiePresent: !!req.headers.cookie,
      },
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('[Debug] Auth error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

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
app.use('/api/bookings', BookingRoutes);

// Mount Auth routes
const AuthRoutes = require('./Routes/AuthRoutes');
app.use('/api/auth', AuthRoutes);

// Mount User routes
const UserRoutes = require('./Routes/UserRoutes');
app.use('/api/users', UserRoutes);

// Mount Notification routes
const NotificationRoutes = require('./Routes/NotificationRoutes');
app.use('/api/notifications', NotificationRoutes);

// Mount Admin routes
const AdminRoutes = require('./Routes/AdminRoutes');
app.use('/api/admin', AdminRoutes);

// Mount Payment routes
const PaymentRoutes = require('./Routes/PaymentRoutes');
app.use('/api/payment', PaymentRoutes);


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

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { serve } = require('inngest/express');
const { clerkMiddleware } = require('@clerk/express');

const ErrorHandler = require('./Middleware/ErrorMiddleware');
const { inngest, functions } = require('./Inngest/Inngest');
const ensureDbConnection = require('./Utils/ensureDbConnection');

const app = express();

// Configure middleware
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
  origin: allowedOrigin || '*',
  credentials: Boolean(allowedOrigin),
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk auth (reads CLERK_SECRET_KEY, etc from env)
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

// Setup admin endpoint - called by frontend with Clerk token
app.get('/api/setup-admin', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await ensureDbConnection();
    }
    const { clerkClient } = require('@clerk/clerk-sdk-node');
    const User = require('./Models/User');

    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.json({
        error: 'no_auth',
        message: 'No auth. Make sure you are logged in via the frontend first.'
      });
    }

    let clerkRole = null;
    try {
      const cUser = await clerkClient.users.getUser(clerkUserId);
      clerkRole = cUser?.publicMetadata?.role;
    } catch (clerkErr) {
      return res.json({ clerkUserId, clerkRoleLookupError: clerkErr.message });
    }

    let user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      user = await User.create({ clerkId: clerkUserId, name: '', email: '', role: clerkRole === 'admin' ? 'admin' : 'user' });
    } else {
      if (clerkRole === 'admin') user.role = 'admin';
      await user.save();
    }

    res.json({
      clerkUserId,
      clerkMetadataRole: clerkRole,
      dbUserRole: user.role,
      isAdmin: user.role === 'admin',
      message: user.role === 'admin'
        ? 'SUCCESS! Refresh the page to access admin dashboard.'
        : 'Not admin. Clerk metadata role is: ' + clerkRole + '. Set role to admin in Clerk dashboard first.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Debug user status endpoint (always available for debugging)
app.get('/api/debug/user', require('@clerk/express').requireAuth(), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await ensureDbConnection();
    }
    const { clerkClient } = require('@clerk/clerk-sdk-node');
    const User = require('./Models/User');

    const clerkUserId = req.auth.userId;

    let clerkRole = null;
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      clerkRole = clerkUser?.publicMetadata?.role;
    } catch {
      // ignore
    }

    const dbUser = await User.findOne({ clerkId: clerkUserId });

    res.json({
      clerkUserId,
      clerkMetadataRole: clerkRole,
      dbUser: dbUser ? { role: dbUser.role, name: dbUser.name, email: dbUser.email } : null,
      wouldPassAdmin: clerkRole === 'admin' || dbUser?.role === 'admin'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mount Inngest handler
app.use('/api/inngest', serve({ client: inngest, functions }));

// Mount TMDB routes (public proxy - used for seeding/admin import)
// NOTE: Frontend accesses TMDB via /api/admin/tmdb/* which is in AdminRoutes
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

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { serve } = require('inngest/express');

const ErrorHandler = require('./Middleware/ErrorMiddleware');
const { inngest, functions } = require('./Inngest/Inngest');

const app = express();

// Configure middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection helper
let isConnected = false;

const ConnectDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

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
      await ConnectDb();
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

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await ConnectDb();
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

// Mount Inngest handler
app.use('/api/inngest', serve({ client: inngest, functions }));

// Error handling
app.use(ErrorHandler);

// Export for Vercel
module.exports = app;
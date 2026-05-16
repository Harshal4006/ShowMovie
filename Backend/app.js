// Load dotenv only in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('Environment:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL);
console.log('MONGO_URI set:', !!process.env.MONGO_URI);
console.log('INNGEST_SIGNING_KEY set:', !!process.env.INNGEST_SIGNING_KEY);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const ErrorHandler = require('./Middleware/ErrorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection - only connect when needed, not globally
let isConnected = false;

const ConnectDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  console.log('MONGO_URI present:', !!mongoUri);

  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    console.log('Attempting MongoDB connection...');

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB Error:', error.message);
    throw error;
  }
};

// Do NOT call ConnectDb() globally on Vercel - causes cold start issues
// ConnectDb();

// Basic route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShowMovie API running'
  });
});

// Health route
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

// Test MongoDB connection endpoint
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

// Inngest route
try {
  console.log('Loading Inngest...');

  const { serve } = require('inngest/express');
  console.log('Inngest express loaded');

  const { inngest, functions } = require('./Inngest/Inngest');
  console.log('Inngest functions loaded, count:', functions.length);

  app.all('/api/inngest', serve({
    client: inngest,
    functions,
  }));

  console.log('Inngest mounted successfully');
} catch (e) {
  console.error('Inngest load error:', e.message);
  console.error(e.stack);
}

// Error handling
app.use(ErrorHandler);

// Export for Vercel
module.exports = app;
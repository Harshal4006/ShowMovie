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

// MongoDB Connection
let isConnected = false;
const ConnectDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  console.log('MONGO_URI present:', !!mongoUri);

  if (!mongoUri || isConnected) {
    console.log('MONGO_URI not set or already connected');
    return;
  }

  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB Error:', error.message);
  }
};

ConnectDb();

// Minimal routes first - test if basic app works
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ShowMovie API running' });
});

app.get('/api/health', async (req, res) => {
  // Always try to connect if not connected
  if (!isConnected && process.env.MONGO_URI) {
    await ConnectDb();
  }

  // Also check mongoose connection state
  const mongoState = mongoose.connection.readyState;
  const connected = isConnected || mongoState === 1;

  res.json({
    status: connected ? 'ok' : 'degraded',
    db: connected ? 'connected' : 'disconnected',
    hasMongoUri: !!process.env.MONGO_URI,
    mongoState: mongoState
  });
});

// Test MongoDB connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
      }
    }

    const User = require('./Models/User');
    const count = await User.countDocuments();
    res.json({ success: true, userCount: count });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Only load Inngest - it's the main requirement
try {
  console.log('Loading Inngest...');
  const { serve } = require("inngest/express");
  console.log('Inngest express loaded');

  const { inngest, functions } = require("./Inngest/Inngest");
  console.log('Inngest functions loaded, count:', functions.length);

  app.use("/api/inngest", serve({ client: inngest, functions }));
  console.log('Inngest mounted successfully');
} catch (e) {
  console.error('Inngest load error:', e.message);
  console.error(e.stack);
}

// Error handling
app.use(ErrorHandler);

// Export for Vercel
module.exports = app;
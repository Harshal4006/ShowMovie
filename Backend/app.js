// Load dotenv only in development (Vercel uses dashboard env vars)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const ErrorHandler = require('./Middleware/ErrorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk middleware (only if configured)
try {
  const { clerkMiddleware } = require('@clerk/express');
  app.use(clerkMiddleware());
} catch (e) {
  console.log('Clerk not configured');
}

// MongoDB Connection
let isConnected = false;
const ConnectDb = async () => {
  if (!process.env.MONGO_URI || isConnected) {
    console.log('MONGO_URI not set or already connected, skipping DB');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Error:', error.message);
  }
};

ConnectDb();

// Load and mount routes safely
const loadRoute = (name, path) => {
  try {
    const route = require(path);
    app.use(name, route);
    console.log(`Loaded route: ${name}`);
  } catch (e) {
    console.error(`Failed to load route ${name}:`, e.message);
  }
};

loadRoute('/api/movies', './Routes/MovieRoutes.js');
loadRoute('/api/shows', './Routes/ShowRoutes.js');
loadRoute('/api/bookings', './Routes/BookingRoutes.js');
loadRoute('/api/admin', './Routes/AdminRoutes.js');
loadRoute('/api/auth', './Routes/AuthRoutes.js');

// Inngest (only if configured)
try {
  const { serve } = require("inngest/express");
  const { inngest, functions } = require("./Inngest/Inngest");
  if (inngest && functions) {
    app.use("/api/inngest", serve({ client: inngest, functions }));
    console.log('Loaded Inngest');
  }
} catch (e) {
  console.log('Inngest not configured:', e.message);
}

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ShowMovie API is running' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: isConnected ? 'ok' : 'degraded', db: isConnected ? 'connected' : 'disconnected' });
});

// Error handling
app.use(ErrorHandler);

// Export for Vercel
module.exports = app;
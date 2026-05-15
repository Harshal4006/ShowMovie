// Load dotenv only in development (Vercel uses dashboard env vars)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const ErrorHandler = require('./Middleware/ErrorMiddleware');

let clerkMiddleware, serve, inngest, functions;
let MovieRoutes, ShowRoutes, BookingRoutes, AdminRoutes, AuthRoutes;

try {
  const clerk = require('@clerk/express');
  clerkMiddleware = clerk.clerkMiddleware;
  const inngestExpress = require("inngest/express");
  serve = inngestExpress.serve;
  const inngestModule = require("./Inngest/Inngest");
  inngest = inngestModule.inngest;
  functions = inngestModule.functions;
} catch (e) {
  console.error('Error loading optional modules:', e.message);
}

// Route imports
try {
  MovieRoutes = require('./Routes/MovieRoutes');
  ShowRoutes = require('./Routes/ShowRoutes');
  BookingRoutes = require('./Routes/BookingRoutes');
  AdminRoutes = require('./Routes/AdminRoutes');
  AuthRoutes = require('./Routes/AuthRoutes');
} catch (e) {
  console.error('Error loading routes:', e.message);
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (clerkMiddleware) {
  app.use(clerkMiddleware());
}

// Static files for uploads (only in local)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
  app.use('/public', express.static(path.join(__dirname, 'Public')));
}

// MongoDB Connection
const ConnectDb = async () => {
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI not set, skipping DB connection');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Error:', error.message);
  }
};

ConnectDb();

// Routes
if (MovieRoutes) app.use('/api/movies', MovieRoutes);
if (ShowRoutes) app.use('/api/shows', ShowRoutes);
if (BookingRoutes) app.use('/api/bookings', BookingRoutes);
if (AdminRoutes) app.use('/api/admin', AdminRoutes);
if (AuthRoutes) app.use('/api/auth', AuthRoutes);
if (serve && inngest && functions) {
  app.use("/api/inngest", serve({ client: inngest, functions }));
}

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1><p>ShowMovie API is running on port 3000</p>');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(ErrorHandler);

// Export for Vercel (serverless) or local development
if (process.env.VERCEL === 'true') {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  module.exports = app;
}
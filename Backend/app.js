// Load dotenv only in development
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
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
let isConnected = false;
const ConnectDb = async () => {
  if (!process.env.MONGO_URI || isConnected) {
    console.log('MONGO_URI not set or already connected');
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

// Minimal routes first - test if basic app works
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ShowMovie API running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: isConnected ? 'ok' : 'degraded', db: isConnected ? 'connected' : 'disconnected' });
});

// Only load Inngest - it's the main requirement
try {
  console.log('Loading Inngest...');
  const { serve } = require("inngest/express");
  const { inngest, functions } = require("./Inngest/Inngest");
  app.use("/api/inngest", serve({ client: inngest, functions }));
  console.log('Inngest loaded successfully');
} catch (e) {
  console.error('Inngest load error:', e.message);
}

// Error handling
app.use(ErrorHandler);

// Export for Vercel
module.exports = app;
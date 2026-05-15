require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const ConnectDb = require('./Config/Db');
const ErrorHandler = require('./Middleware/ErrorMiddleware');
const { clerkMiddleware } = require('@clerk/express');
const { serve } = require("inngest/express");
const { inngest, functions } = require("./Inngest/Inngest");


// Route imports
const MovieRoutes = require('./Routes/MovieRoutes');
const ShowRoutes = require('./Routes/ShowRoutes');
const BookingRoutes = require('./Routes/BookingRoutes');
const AdminRoutes = require('./Routes/AdminRoutes');
const AuthRoutes = require('./Routes/AuthRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/public', express.static(path.join(__dirname, 'Public')));

// Connect to MongoDB
ConnectDb()

// Routes
app.use('/api/movies', MovieRoutes);
app.use('/api/shows', ShowRoutes);
app.use('/api/bookings', BookingRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/auth', AuthRoutes);
app.use("/api/inngest", serve({ client: inngest, functions }));

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
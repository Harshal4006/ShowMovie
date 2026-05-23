const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Check validation results and return errors if any
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Validates MongoDB ObjectId format
const isValidObjectId = (value) => mongoose.isValidObjectId(value);

// ── Booking Validators ──
const validateCreateBooking = [
  body('showId')
    .notEmpty().withMessage('showId is required')
    .custom(isValidObjectId).withMessage('Invalid showId format'),
  body('bookedSeats')
    .isArray({ min: 1 }).withMessage('bookedSeats must be a non-empty array'),
  body('bookedSeats.*')
    .isString().trim().notEmpty().withMessage('Each seat must be a non-empty string'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  handleValidation,
];

// ── Payment Validators ──
const validateCreateOrder = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  handleValidation,
];

// ── Theater Validators ──
const validateCreateTheater = [
  body('name').notEmpty().withMessage('Theater name is required').trim(),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('city').notEmpty().withMessage('City is required').trim(),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Invalid email format'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('screens').optional().isInt({ min: 1 }).withMessage('Screens must be at least 1'),
  handleValidation,
];

const validateUpdateTheater = [
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Invalid email format'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('screens').optional().isInt({ min: 1 }).withMessage('Screens must be at least 1'),
  handleValidation,
];

// ── Show Validators ──
const validateCreateShow = [
  body('showPrice')
    .notEmpty().withMessage('Show price is required')
    .isFloat({ min: 1 }).withMessage('Show price must be a positive number'),
  body('theater')
    .notEmpty().withMessage('Theater is required').trim(),
  body('showDateTime').optional(),
  body('showDateTimes').optional().isArray(),
  handleValidation,
];

// ── Movie Validators ──
const validateImportMovie = [
  body('tmdbId')
    .notEmpty().withMessage('TMDB ID is required'),
  handleValidation,
];

// ── User Validators ──
const validateUpdateProfile = [
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Invalid email format'),
  handleValidation,
];

const validateUpdateRole = [
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
  handleValidation,
];

const validateToggleFavorite = [
  body('tmdbId')
    .notEmpty().withMessage('tmdbId is required'),
  handleValidation,
];

// ── Search Query Sanitizer ──
const sanitizeSearch = (req, res, next) => {
  if (req.query.search) {
    req.query.search = req.query.search
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .slice(0, 100);
  }
  if (req.query.city) {
    req.query.city = req.query.city
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .slice(0, 100);
  }
  next();
};

module.exports = {
  validateCreateBooking,
  validateCreateOrder,
  validateCreateTheater,
  validateUpdateTheater,
  validateCreateShow,
  validateImportMovie,
  validateUpdateProfile,
  validateUpdateRole,
  validateToggleFavorite,
  sanitizeSearch,
};

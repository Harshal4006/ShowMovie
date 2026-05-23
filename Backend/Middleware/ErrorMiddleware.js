// Global error handler for Mongoose and server errors
const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. This record already exists.',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.statusCode === 500 || !err.statusCode
      ? 'Internal server error'
      : err.message,
  });
};

module.exports = ErrorHandler;
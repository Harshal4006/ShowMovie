// Utility kept for reference - not currently imported

// Wrap successful API response in a standard format
const FormatResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data
  };
};

// Wrap error response in a standard format
const FormatError = (message = 'Error', statusCode = 500) => {
  return {
    success: false,
    statusCode,
    message
  };
};

module.exports = { FormatResponse, FormatError };
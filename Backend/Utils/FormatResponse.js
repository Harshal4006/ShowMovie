// Utility kept for reference - not currently imported

// Format API Response
const FormatResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data
  };
};

const FormatError = (message = 'Error', statusCode = 500) => {
  return {
    success: false,
    statusCode,
    message
  };
};

module.exports = { FormatResponse, FormatError };
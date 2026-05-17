const mongoose = require('mongoose');

let connectingPromise = null;

const ensureDbConnection = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  if (mongoose.connection.readyState === 1) return;
  if (connectingPromise) return connectingPromise;

  connectingPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
};

module.exports = ensureDbConnection;


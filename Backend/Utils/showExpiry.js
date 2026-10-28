const Show = require('../Models/Show');
const Movie = require('../Models/Movie');
const mongoose = require('mongoose');
const ensureDbConnection = require('../Utils/ensureDbConnection');

const getShowEndTime = (show) => {
  if (show.endDateTime) {
    const end = new Date(show.endDateTime);
    if (!Number.isNaN(end.getTime())) {
      return end;
    }
  }
  const start = show.showDateTime ? new Date(show.showDateTime) : null;
  if (!start || Number.isNaN(start.getTime())) {
    return null;
  }
  const runtime = show.movie && typeof show.movie === 'object' ? show.movie.runtime : null;
  if (runtime && typeof runtime === 'number' && runtime > 0) {
    return new Date(start.getTime() + runtime * 60 * 1000);
  }
  // Fallback: assume 2.5 hours if runtime unknown
  return new Date(start.getTime() + 150 * 60 * 1000);
};

const expireShowsNow = async () => {
  await ensureDbConnection();
  const now = new Date();
  const shows = await Show.find({
    status: { $nin: ['completed', 'expired'] }
  }).populate('movie', 'runtime').lean();

  const updates = [];
  for (const show of shows) {
    const end = getShowEndTime(show);
    if (end && end <= now) {
      updates.push(Show.updateOne({ _id: show._id, status: { $nin: ['completed', 'expired'] } }, { $set: { status: 'expired' } }));
    }
  }
  if (updates.length > 0) {
    await Promise.all(updates);
  }
  return updates.length;
};

module.exports = { getShowEndTime, expireShowsNow };

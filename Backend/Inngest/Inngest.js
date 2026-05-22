const { Inngest } = require("inngest");
const mongoose = require("mongoose");
const { getClerkUserMetadata, extractRoleFromClerk } = require("../Utils/clerkSync");
const EmailService = require("../Services/EmailService");

mongoose.set("strictQuery", true);

// Reusable DB connection check
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not configured");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log('MongoDB connected for Inngest function');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

const inngest = new Inngest({
  id: "movie-ticket-booking",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Sync Clerk user creation
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    name: "Sync User Creation",
    timeout: "30s",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data || {};

    if (!id) {
      throw new Error("No user ID in event");
    }

    await connectDB();

    const User = require("../Models/User");

    const existing = await User.findOne({ clerkId: id });

    if (existing) {
      console.log('User already exists:', id);
      return {
        success: true,
        message: "User exists",
        userId: existing._id.toString(),
      };
    }

    let role = 'user';
    try {
      const userMetadata = await getClerkUserMetadata(id);
      role = extractRoleFromClerk(userMetadata);
      console.log(`Clerk metadata for ${id}: role = ${role}`);
    } catch (err) {
      console.warn(`Failed to fetch Clerk metadata for ${id}, defaulting to user role`);
    }

    const user = await User.create({
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses?.[0]?.email_address || "",
      img: image_url || "",
      role: role,
    });

    console.log('User created via Clerk sync:', user._id, 'with role:', role);

    return {
      success: true,
      message: "User created",
      userId: user._id.toString(),
      role: role,
    };
  }
);

// Sync Clerk user update
const syncUserUpdate = inngest.createFunction(
  {
    id: "sync-user-update",
    name: "Sync User Update",
    timeout: "30s",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data || {};

    if (!id) {
      throw new Error("No user ID in event");
    }

    await connectDB();

    const User = require("../Models/User");

    const user = await User.findOne({ clerkId: id });

    if (!user) {
      return {
        success: true,
        message: "User not found",
        clerkId: id,
      };
    }

    user.name = `${first_name || ""} ${last_name || ""}`.trim();
    user.email = email_addresses?.[0]?.email_address || user.email;

    if (image_url) {
      user.img = image_url;
    }

    let roleUpdated = false;
    try {
      const userMetadata = await getClerkUserMetadata(id);
      const newRole = extractRoleFromClerk(userMetadata);

      if (newRole !== user.role) {
        console.log(`Role change detected for ${id}: ${user.role} -> ${newRole}`);
        user.role = newRole;
        roleUpdated = true;
      }
    } catch (err) {
      console.warn(`Failed to fetch Clerk metadata for role update: ${err.message}`);
    }

    await user.save();

    console.log('User updated via Clerk sync:', user._id, roleUpdated ? `, role updated to: ${user.role}` : '');

    return {
      success: true,
      message: "User updated",
      userId: user._id.toString(),
      role: user.role,
    };
  }
);

// Sync Clerk user deletion
const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-delete",
    name: "Sync User Deletion",
    timeout: "30s",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { id } = event.data || {};

    if (!id) {
      throw new Error("No user ID in event");
    }

    await connectDB();

    const User = require("../Models/User");

    const user = await User.findOneAndDelete({ clerkId: id });

    if (!user) {
      return {
        success: true,
        message: "User not found",
        clerkId: id,
      };
    }

    console.log('User deleted via Clerk sync:', user._id);

    return {
      success: true,
      message: "User deleted",
      userId: user._id.toString(),
    };
  }
);

// Booking Confirmed Email
const bookingConfirmedEmail = inngest.createFunction(
  {
    id: "booking-confirmed-email",
    name: "Send Booking Confirmed Email",
    retries: 2,
    timeout: "30s",
    triggers: [{ event: "booking/confirmed" }],
  },
  async ({ event }) => {
    await connectDB();
    const { bookingId, userId, userEmail, userName, movieTitle, seats, amount, showDate, showTime, theater, paymentId } = event.data || {};

    if (!bookingId || !userEmail) {
      console.error("Missing required data for booking confirmed email");
      return { success: false, reason: "Missing required data" };
    }

    const Booking = require("../Models/Booking");
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error("Booking not found:", bookingId);
      return { success: false, reason: "Booking not found" };
    }

    if (booking.emailSent === 'confirmed') {
      console.log("Duplicate prevention: confirmed email already sent for", bookingId);
      return { success: true, reason: "Email already sent" };
    }

    const result = await EmailService.sendBookingConfirmed({
      userEmail,
      userName: userName || 'Movie Lover',
      movieTitle,
      bookingId,
      seats,
      amount,
      showDate,
      showTime,
      theater,
      paymentId,
    });

    if (result.success) {
      await Booking.findByIdAndUpdate(bookingId, { emailSent: 'confirmed' });
      console.log("Booking notification sent:", bookingId);
    }

    return result;
  }
);

// Booking Pending Email
const bookingPendingEmail = inngest.createFunction(
  {
    id: "booking-pending-email",
    name: "Send Booking Pending Email",
    retries: 2,
    timeout: "30s",
    triggers: [{ event: "booking/pending" }],
  },
  async ({ event }) => {
    await connectDB();
    const { bookingId, userEmail, userName, movieTitle, amount, showDate, showTime } = event.data || {};

    if (!bookingId || !userEmail) {
      console.error("Missing required data for booking pending email");
      return { success: false, reason: "Missing required data" };
    }

    const Booking = require("../Models/Booking");
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error("Booking not found:", bookingId);
      return { success: false, reason: "Booking not found" };
    }

    if (booking.emailSent === 'pending') {
      console.log("Duplicate prevention: pending email already sent for", bookingId);
      return { success: true, reason: "Email already sent" };
    }

    const result = await EmailService.sendBookingPending({
      userEmail,
      userName: userName || 'Movie Lover',
      movieTitle,
      bookingId,
      amount,
      showDate,
      showTime,
    });

    if (result.success) {
      await Booking.findByIdAndUpdate(bookingId, { emailSent: 'pending' });
      console.log("Booking notification sent:", bookingId);
    }

    return result;
  }
);

// Booking Failed Email
const bookingFailedEmail = inngest.createFunction(
  {
    id: "booking-failed-email",
    name: "Send Booking Failed Email",
    retries: 2,
    timeout: "30s",
    triggers: [{ event: "booking/failed" }],
  },
  async ({ event }) => {
    await connectDB();
    const { bookingId, userEmail, userName, movieTitle, amount, showDate, showTime, errorMessage } = event.data || {};

    if (!bookingId || !userEmail) {
      console.error("Missing required data for booking failed email");
      return { success: false, reason: "Missing required data" };
    }

    const result = await EmailService.sendBookingFailed({
      userEmail,
      userName: userName || 'Movie Lover',
      movieTitle,
      amount,
      showDate,
      showTime,
      errorMessage: errorMessage || 'Payment could not be processed',
    });

    if (result.success) {
      console.log("Booking notification sent for failed booking:", bookingId);
    }

    return result;
  }
);

// New Show Added Email - sends to all users
const newShowAddedEmail = inngest.createFunction(
  {
    id: "new-show-added-email",
    name: "Send New Show Added Email",
    retries: 2,
    timeout: "5m",
    concurrency: { limit: 10 },
    triggers: [{ event: "show/added" }],
  },
  async ({ event }) => {
    await connectDB();
    const { showId, movieTitle, moviePoster, showDate, showTime, theater, screenType, language, price } = event.data || {};

    if (!showId || !movieTitle) {
      console.error("Missing required data for show added email");
      return { success: false, reason: "Missing required data" };
    }

    const User = require("../Models/User");
    const allUsers = await User.find({}).select('email name');

    let sentCount = 0;
    let failedCount = 0;

    for (const user of allUsers) {
      if (!user.email) continue;

      try {
        const result = await EmailService.sendNewShowAdded({
          userEmail: user.email,
          userName: user.name || 'Movie Lover',
          movieTitle,
          moviePoster,
          showDate,
          showTime,
          theater,
          screenType,
          language,
          price,
        });

        if (result.success) sentCount++;
        else failedCount++;
      } catch (err) {
        console.error("Failed to send show added email to", user.email, err.message);
        failedCount++;
      }
    }

    console.log(`Show added emails: ${sentCount} sent, ${failedCount} failed`);
    return { success: true, sentCount, failedCount };
  }
);

const functions = [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
  bookingConfirmedEmail,
  bookingPendingEmail,
  bookingFailedEmail,
  newShowAddedEmail,
];

module.exports = {
  inngest,
  functions,
};
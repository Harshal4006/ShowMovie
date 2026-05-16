const { Inngest } = require("inngest");
const mongoose = require("mongoose");

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

    const user = await User.create({
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses?.[0]?.email_address || "",
      img: image_url || "",
    });

    console.log('User created via Clerk sync:', user._id);

    return {
      success: true,
      message: "User created",
      userId: user._id.toString(),
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

    await user.save();

    console.log('User updated via Clerk sync:', user._id);

    return {
      success: true,
      message: "User updated",
      userId: user._id.toString(),
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

const functions = [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
];

module.exports = {
  inngest,
  functions,
};
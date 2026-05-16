const { Inngest } = require("inngest");
const mongoose = require("mongoose");

// Safe mongoose global setting only
mongoose.set("strictQuery", true);

console.log("INNGEST_SIGNING_KEY set:", !!process.env.INNGEST_SIGNING_KEY);
console.log("MONGO_URI set:", !!process.env.MONGO_URI);

// Reusable DB connection check
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("DB already connected");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not configured");
  }

  console.log("Connecting to MongoDB...");

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

const inngest = new Inngest({
  id: "movie-ticket-booking",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Test function
const testFunction = inngest.createFunction(
  {
    id: "test-clerk",
    name: "Test Function",
    timeout: "30s",
    triggers: [{ event: "test/clerk" }],
  },
  async ({ event }) => {
    console.log("Test function ran with:", event.name);
    return {
      success: true,
      eventName: event.name,
    };
  }
);

// Sync user creation
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    name: "Sync User Creation",
    timeout: "30s",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    console.log("Inngest user.created started");

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data || {};

    if (!id) {
      throw new Error("No user ID in event");
    }

    console.log("Processing user:", id);

    await connectDB();

    const User = require("../Models/User");

    const existing = await User.findOne({ clerkId: id });

    if (existing) {
      console.log("User exists:", existing._id);
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

    console.log("User created:", user._id);

    return {
      success: true,
      message: "User created",
      userId: user._id.toString(),
    };
  }
);

// Sync user update
const syncUserUpdate = inngest.createFunction(
  {
    id: "sync-user-update",
    name: "Sync User Update",
    timeout: "30s",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    console.log("Inngest user.updated started");

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

    console.log("User updated:", user._id);

    return {
      success: true,
      message: "User updated",
      userId: user._id.toString(),
    };
  }
);

// Sync user deletion
const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-delete",
    name: "Sync User Deletion",
    timeout: "30s",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    console.log("Inngest user.deleted started");

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

    console.log("User deleted:", user._id);

    return {
      success: true,
      message: "User deleted",
      userId: user._id.toString(),
    };
  }
);

const functions = [
  testFunction,
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
];

module.exports = {
  inngest,
  functions,
};
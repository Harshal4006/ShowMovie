const { Inngest } = require("inngest");

// Pre-configured mongoose connection for reuse
const mongoose = require("mongoose");

// Configure mongoose for serverless - reduce timeouts and enable keepAlive
mongoose.set("maxTimeMS", 5000);
mongoose.set("serverSelectionTimeoutMS", 5000);
mongoose.set("connectTimeoutMS", 5000);

// Log environment status on startup
console.log("INNGEST_SIGNING_KEY set:", !!process.env.INNGEST_SIGNING_KEY);
console.log("MONGO_URI set:", !!process.env.MONGO_URI);

const inngest = new Inngest({
  id: "movie-ticket-booking",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Test function first
const testFunction = inngest.createFunction(
  { id: "test-clerk", name: "Test Function", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    console.log("Test function ran with:", event.name);
    return { success: true, eventName: event.name, data: event.data };
  }
);

// Helper function to ensure MongoDB connection
async function ensureConnection() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not configured");
  }
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });
  console.log("MongoDB connected");
}

// Create user function
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", name: "Sync User Creation", retries: 0, timeout: "30s" },
  async ({ event }) => {
    console.log("Running syncUserCreation for:", event.data?.id);

    const User = require("../Models/User");

    const { id, first_name, last_name, email_addresses, image_url } = event.data || {};

    if (!id) throw new Error("No user ID in event");

    await ensureConnection();

    const existing = await User.findOne({ clerkId: id });
    if (existing) {
      console.log("User exists:", existing._id);
      return { message: "User exists", userId: existing._id.toString() };
    }

    const user = await User.create({
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses?.[0]?.email_address || "",
      img: image_url || "",
    });

    console.log("User created:", user._id);
    return { message: "Created", userId: user._id.toString() };
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update", name: "Sync User Update", retries: 0, timeout: "30s" },
  async ({ event }) => {
    console.log("Running syncUserUpdate for:", event.data?.id);

    const User = require("../Models/User");

    const { id, first_name, last_name, email_addresses, image_url } = event.data || {};

    if (!id) throw new Error("No user ID in event");

    await ensureConnection();

    const user = await User.findOne({ clerkId: id });
    if (!user) {
      return { message: "User not found", clerkId: id };
    }

    user.name = `${first_name || ""} ${last_name || ""}`.trim();
    user.email = email_addresses?.[0]?.email_address || user.email;
    if (image_url) user.img = image_url;
    await user.save();

    return { message: "Updated", userId: user._id.toString() };
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete", name: "Sync User Deletion", retries: 0, timeout: "30s" },
  async ({ event }) => {
    console.log("Running syncUserDeletion for:", event.data?.id);

    const User = require("../Models/User");

    const { id } = event.data || {};

    if (!id) throw new Error("No user ID in event");

    await ensureConnection();

    const user = await User.findOneAndDelete({ clerkId: id });
    if (!user) {
      return { message: "User not found", clerkId: id };
    }

    return { message: "Deleted", userId: user._id.toString() };
  }
);

const functions = [testFunction, syncUserCreation, syncUserUpdate, syncUserDeletion];

module.exports = { inngest, functions };
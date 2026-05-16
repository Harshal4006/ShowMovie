const { Inngest } = require("inngest");

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

// Create user function
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", name: "Sync User Creation", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    console.log("Running syncUserCreation for:", event.data?.id);

    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not set");
      throw new Error("MONGO_URI not configured");
    }

    const mongoose = require("mongoose");
    const User = require("../Models/User");

    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data || {};

      if (!id) throw new Error("No user ID in event");

      // Use existing connection or connect if needed
      if (mongoose.connection.readyState !== 1) {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000
        });
        console.log("MongoDB connected");
      }

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
    } catch (err) {
      console.error("Create user error:", err.message);
      throw err;
    }
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update", name: "Sync User Update", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    console.log("Running syncUserUpdate for:", event.data?.id);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not configured");
    }

    const mongoose = require("mongoose");
    const User = require("../Models/User");

    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data || {};

      if (!id) throw new Error("No user ID in event");

      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000
        });
      }

      const user = await User.findOne({ clerkId: id });
      if (!user) {
        return { message: "User not found", clerkId: id };
      }

      user.name = `${first_name || ""} ${last_name || ""}`.trim();
      user.email = email_addresses?.[0]?.email_address || user.email;
      if (image_url) user.img = image_url;
      await user.save();

      return { message: "Updated", userId: user._id.toString() };
    } catch (err) {
      console.error("Update user error:", err.message);
      throw err;
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete", name: "Sync User Deletion", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    console.log("Running syncUserDeletion for:", event.data?.id);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not configured");
    }

    const mongoose = require("mongoose");
    const User = require("../Models/User");

    try {
      const { id } = event.data || {};

      if (!id) throw new Error("No user ID in event");

      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000
        });
      }

      const user = await User.findOneAndDelete({ clerkId: id });
      if (!user) {
        return { message: "User not found", clerkId: id };
      }

      return { message: "Deleted", userId: user._id.toString() };
    } catch (err) {
      console.error("Delete user error:", err.message);
      throw err;
    }
  }
);

const functions = [testFunction, syncUserCreation, syncUserUpdate, syncUserDeletion];

module.exports = { inngest, functions };
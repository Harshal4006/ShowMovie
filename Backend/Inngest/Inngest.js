const { Inngest } = require("inngest");
const mongoose = require("mongoose");

const inngest = new Inngest({
  id: "movie-ticket-booking",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", name: "Sync User Creation", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const userData = event.data || {};
    const clerkId = userData.id;

    console.log("User data from Clerk:", JSON.stringify(userData));

    // Connect to MongoDB
    try {
      if (!process.env.MONGO_URI) {
        return { error: "MONGO_URI not set" };
      }

      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI);
      }

      const User = require("../Models/User");

      // Check if user exists
      const existing = await User.findOne({ clerkId });
      if (existing) {
        return { message: "User already exists", userId: existing._id.toString() };
      }

      // Create user
      const user = await User.create({
        clerkId: clerkId,
        name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        email: userData.email_addresses?.[0]?.email_address || "",
        img: userData.image_url || "",
      });

      return { message: "User created", userId: user._id.toString() };
    } catch (err) {
      console.error("Error:", err.message);
      return { error: err.message };
    }
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update", name: "Sync User Update", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const userData = event.data || {};
    const clerkId = userData.id;

    try {
      if (!process.env.MONGO_URI) {
        return { error: "MONGO_URI not set" };
      }

      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI);
      }

      const User = require("../Models/User");
      const user = await User.findOne({ clerkId });

      if (!user) {
        return { message: "User not found" };
      }

      user.name = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
      user.email = userData.email_addresses?.[0]?.email_address || user.email;
      if (userData.image_url) user.img = userData.image_url;
      await user.save();

      return { message: "User updated", userId: user._id.toString() };
    } catch (err) {
      console.error("Error:", err.message);
      return { error: err.message };
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete", name: "Sync User Deletion", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const userData = event.data || {};
    const clerkId = userData.id;

    try {
      if (!process.env.MONGO_URI) {
        return { error: "MONGO_URI not set" };
      }

      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI);
      }

      const User = require("../Models/User");
      const user = await User.findOneAndDelete({ clerkId });

      if (!user) {
        return { message: "User not found" };
      }

      return { message: "User deleted", userId: user._id.toString() };
    } catch (err) {
      console.error("Error:", err.message);
      return { error: err.message };
    }
  }
);

const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion];

module.exports = { inngest, functions };
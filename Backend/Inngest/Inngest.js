const { Inngest } = require("inngest");

const inngest = new Inngest({
  id: "movie-ticket-booking",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Test function first
const testFunction = inngest.createFunction(
  { id: "test-clerk", name: "Test Function", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    return { success: true, eventName: event.name, data: event.data };
  }
);

// Create user function
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", name: "Sync User Creation", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data || {};
      const mongoose = require("mongoose");

      if (!process.env.MONGO_URI) return { error: "No MONGO_URI" };

      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });

      const User = require("../Models/User");

      const existing = await User.findOne({ clerkId: id });
      if (existing) {
        await mongoose.disconnect();
        return { message: "User exists", userId: existing._id.toString() };
      }

      const user = await User.create({
        clerkId: id,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        email: email_addresses?.[0]?.email_address || "",
        img: image_url || "",
      });

      await mongoose.disconnect();
      return { message: "Created", userId: user._id.toString() };
    } catch (err) {
      console.error("Error:", err.message);
      return { error: err.message };
    }
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update", name: "Sync User Update", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data || {};
      const mongoose = require("mongoose");

      if (!process.env.MONGO_URI) return { error: "No MONGO_URI" };

      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });

      const User = require("../Models/User");

      const user = await User.findOne({ clerkId: id });
      if (!user) {
        await mongoose.disconnect();
        return { message: "User not found" };
      }

      user.name = `${first_name || ""} ${last_name || ""}`.trim();
      user.email = email_addresses?.[0]?.email_address || user.email;
      if (image_url) user.img = image_url;
      await user.save();

      await mongoose.disconnect();
      return { message: "Updated", userId: user._id.toString() };
    } catch (err) {
      return { error: err.message };
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete", name: "Sync User Deletion", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    try {
      const { id } = event.data || {};
      const mongoose = require("mongoose");

      if (!process.env.MONGO_URI) return { error: "No MONGO_URI" };

      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });

      const User = require("../Models/User");

      const user = await User.findOneAndDelete({ clerkId: id });
      if (!user) {
        await mongoose.disconnect();
        return { message: "User not found" };
      }

      await mongoose.disconnect();
      return { message: "Deleted", userId: user._id.toString() };
    } catch (err) {
      return { error: err.message };
    }
  }
);

const functions = [testFunction, syncUserCreation, syncUserUpdate, syncUserDeletion];

module.exports = { inngest, functions };
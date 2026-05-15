const { Inngest } = require("inngest");
const mongoose = require("mongoose");

const inngest = new Inngest({
  id: "movie-ticket-booking",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Helper to ensure MongoDB is connected
async function ensureDbConnection() {
  if (mongoose.connection.readyState !== 1) {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
    }
  }
}

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", name: "Sync User Creation", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    console.log("Event received:", event.name);

    try {
      await ensureDbConnection();

      if (mongoose.connection.readyState !== 1) {
        console.log("MongoDB not connected");
        return { message: "Database not available" };
      }

      const User = require("../Models/User");
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      console.log("Creating user:", id);

      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        console.log("User already exists");
        return { message: "User already exists" };
      }

      const user = await User.create({
        clerkId: id,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        email: email_addresses?.[0]?.email_address || "",
        img: image_url || "",
      });

      console.log("User created:", user._id);
      return { message: "User created", userId: user._id };
    } catch (error) {
      console.error("Error in syncUserCreation:", error.message);
      return { message: "Error", error: error.message };
    }
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update", name: "Sync User Update", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    console.log("Update event received:", event.name);

    try {
      await ensureDbConnection();

      if (mongoose.connection.readyState !== 1) {
        return { message: "Database not available" };
      }

      const User = require("../Models/User");
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const user = await User.findOne({ clerkId: id });
      if (!user) return { message: "User not found" };

      user.name = `${first_name || ""} ${last_name || ""}`.trim();
      user.email = email_addresses?.[0]?.email_address || user.email;
      if (image_url) user.img = image_url;
      await user.save();

      return { message: "User updated", userId: user._id };
    } catch (error) {
      console.error("Error in syncUserUpdate:", error.message);
      return { message: "Error", error: error.message };
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete", name: "Sync User Deletion", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    console.log("Delete event received:", event.name);

    try {
      await ensureDbConnection();

      if (mongoose.connection.readyState !== 1) {
        return { message: "Database not available" };
      }

      const User = require("../Models/User");
      const { id } = event.data;

      const user = await User.findOneAndDelete({ clerkId: id });
      if (!user) return { message: "User not found" };

      return { message: "User deleted", userId: user._id };
    } catch (error) {
      console.error("Error in syncUserDeletion:", error.message);
      return { message: "Error", error: error.message };
    }
  }
);

const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion];

module.exports = { inngest, functions };
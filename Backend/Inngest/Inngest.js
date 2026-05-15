const { Inngest } = require("inngest");

const inngest = new Inngest({
  id: "movie-ticket-booking",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", name: "Sync User Creation", timeout: "10s", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data || {};

    console.log("Creating user:", id);

    // Use a fresh mongoose connection approach
    const mongoose = require("mongoose");
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) return { error: "No MONGO_URI" };

    // Quick connect with short timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });

    const User = mongoose.model('User', require("../Models/User").schema);

    const existing = await User.findOne({ clerkId: id });
    if (existing) return { message: "User exists", userId: existing._id.toString() };

    const user = await User.create({
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses?.[0]?.email_address || "",
      img: image_url || "",
    });

    await mongoose.disconnect();
    return { message: "Created", userId: user._id.toString() };
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update", name: "Sync User Update", timeout: "10s", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data || {};

    const mongoose = require("mongoose");
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) return { error: "No MONGO_URI" };

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
    const User = mongoose.model('User', require("../Models/User").schema);

    const user = await User.findOne({ clerkId: id });
    if (!user) return { message: "User not found" };

    user.name = `${first_name || ""} ${last_name || ""}`.trim();
    user.email = email_addresses?.[0]?.email_address || user.email;
    if (image_url) user.img = image_url;
    await user.save();

    await mongoose.disconnect();
    return { message: "Updated", userId: user._id.toString() };
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete", name: "Sync User Deletion", timeout: "10s", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const { id } = event.data || {};

    const mongoose = require("mongoose");
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) return { error: "No MONGO_URI" };

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
    const User = mongoose.model('User', require("../Models/User").schema);

    const user = await User.findOneAndDelete({ clerkId: id });
    if (!user) return { message: "User not found" };

    await mongoose.disconnect();
    return { message: "Deleted", userId: user._id.toString() };
  }
);

const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion];

module.exports = { inngest, functions };
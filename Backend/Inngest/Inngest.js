const { Inngest } = require("inngest");
const User = require("../Models/User");

const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const existingUser = await User.findOne({ clerkId: id });
    if (existingUser) return { message: "User already exists" };

    const user = await User.create({
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses?.[0]?.email_address || "",
      img: image_url || "",
    });

    return { message: "User created", userId: user._id };
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const user = await User.findOne({ clerkId: id });
    if (!user) return { message: "User not found" };

    user.name = `${first_name || ""} ${last_name || ""}`.trim();
    user.email = email_addresses?.[0]?.email_address || user.email;
    if (image_url) user.img = image_url;
    await user.save();

    return { message: "User updated", userId: user._id };
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const { id } = event.data;

    const user = await User.findOneAndDelete({ clerkId: id });
    if (!user) return { message: "User not found" };

    return { message: "User deleted", userId: user._id };
  }
);

const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion];

module.exports = { inngest, functions };
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/userModel.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
    process.exit(1);
  }

  let admin = await User.findOne({ email });

  if (admin) {
    admin.isAdmin = true;
    admin.password = password; // will be re-hashed by your pre-save hook
    await admin.save();
    console.log(`✅ Existing user "${email}" upgraded to admin`);
  } else {
    admin = await User.create({
      name: "Admin",
      email,
      password,
      isAdmin: true,
    });
    console.log(`✅ Admin account created: ${email}`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@townpulse.com";
    const adminPassword = "Admin@12345";

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.fullName = "TownPulse Admin";
      admin.password = hashedPassword;
      admin.role = "admin";

      await admin.save();

      console.log("Existing admin account updated.");
    } else {
      admin = await User.create({
        fullName: "TownPulse Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin account created successfully.");
    }

    console.log("Admin email:", adminEmail);
    console.log("Admin password:", adminPassword);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();

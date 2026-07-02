const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Needed for hashing passwords
const User = require("../models/User"); // Adjust this path if your User model is located elsewhere

const { authMiddleware } = require("../middleware/authMiddleware");

// --- Existing Route: Get User Profile ---
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

// --- NEW Route: Create a User (POST /users) ---
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // 2. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    const savedUser = await newUser.save();

    // 4. Send success response back to React
    res.status(201).json({
      success: true,
      _id: savedUser._id, // React needs this ID to auto-fill the form!
      name: savedUser.name,
      email: savedUser.email
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
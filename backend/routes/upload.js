const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User"); 
const Student = require("../models/Student"); // CRITICAL: Import the Student model

// Set up Multer Storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// POST /api/upload - Uploads a new photo
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.body.userId; 
    const filePath = req.file.path.replace(/\\/g, "/"); 

    if (userId) {
      // 1. Update the User collection
      await User.findByIdAndUpdate(userId, { profileImage: filePath });
      
      // 2. Update the Student collection (This fixes your dashboard!)
      await Student.findOneAndUpdate({ userId: userId }, { profileImage: filePath });
    }

    res.json({ success: true, profileImage: filePath });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// DELETE /api/upload/photo/:userId - Deletes the current photo
router.delete("/photo/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // 1. Clear from User collection
    await User.findByIdAndUpdate(userId, { profileImage: "" });
    
    // 2. Clear from Student collection
    await Student.findOneAndUpdate({ userId: userId }, { profileImage: "" });
    
    res.json({ success: true, message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Delete photo error:", err);
    res.status(500).json({ message: "Failed to delete photo" });
  }
});

module.exports = router;
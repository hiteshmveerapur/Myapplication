const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const Student = require("../models/Student"); 

// CRITICAL: Import the upload middleware from your new Cloudinary config
const { upload } = require("../config/cloudinary");

// POST /api/upload - Uploads a new photo to Cloudinary
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.body.userId; 
    
    // With Cloudinary, req.file.path is NOT a local folder. 
    // It is the actual, secure HTTPS link to the image on the internet!
    const imageUrl = req.file.path; 

    if (userId) {
      // 1. Update the User collection
      await User.findByIdAndUpdate(userId, { profileImage: imageUrl });
      
      // 2. Update the Student collection
      await Student.findOneAndUpdate({ userId: userId }, { profileImage: imageUrl });
    }

    res.json({ success: true, profileImage: imageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// DELETE /api/upload/photo/:userId - Deletes the current photo from the database
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
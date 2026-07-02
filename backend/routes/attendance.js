const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getAttendanceByStudent,
  getAttendancePercentage,
} = require("../controllers/attendanceController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ===========================================
// Protected Routes
// ===========================================

// Get all attendance
router.get(
  "/",
  authMiddleware,
  getAttendance
);

// Get attendance of one student
router.get(
  "/student/:studentId",
  authMiddleware,
  getAttendanceByStudent
);

// Get attendance percentage
router.get(
  "/percentage/:studentId",
  authMiddleware,
  getAttendancePercentage
);

// ===========================================
// Teacher & Admin
// ===========================================

// Mark attendance (Manual / QR)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  markAttendance
);

module.exports = router;
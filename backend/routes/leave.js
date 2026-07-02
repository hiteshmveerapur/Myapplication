const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getLeaves,
  getStudentLeaves,
  approveLeave,
  rejectLeave,
  getLeaveStatistics,
} = require("../controllers/leaveController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ===========================================
// Student Routes
// ===========================================

// Apply Leave
router.post(
  "/",
  authMiddleware,
  authorizeRoles("student"),
  applyLeave
);

// View own leave history
router.get(
  "/student/:studentId",
  authMiddleware,
  getStudentLeaves
);

// ===========================================
// Teacher & Admin Routes
// ===========================================

// View all leave requests
router.get(
  "/",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  getLeaves
);

// Approve Leave
router.put(
  "/approve/:id",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  approveLeave
);

// Reject Leave
router.put(
  "/reject/:id",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  rejectLeave
);

// Leave Statistics
router.get(
  "/statistics",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  getLeaveStatistics
);

module.exports = router;
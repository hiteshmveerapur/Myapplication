const express = require("express");
const router = express.Router();

const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// =====================================
// Protected Routes
// =====================================

// Get all teachers
router.get(
  "/",
  authMiddleware,
  getTeachers
);

// Get single teacher
router.get(
  "/:id",
  authMiddleware,
  getTeacherById
);

// =====================================
// Admin Only Routes
// =====================================

// Add Teacher
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createTeacher
);

// Update Teacher
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateTeacher
);

// Delete Teacher
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteTeacher
);

module.exports = router;
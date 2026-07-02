const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ==============================
// Public/Protected Routes
// ==============================

// Get all students
router.get(
  "/",
  authMiddleware,
  getStudents
);

// Get single student
router.get(
  "/:id",
  authMiddleware,
  getStudentById
);

// ==============================
// Admin Only Routes
// ==============================

// Create Student
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createStudent
);

// Update Student
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateStudent
);

// Delete Student
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteStudent
);

module.exports = router;
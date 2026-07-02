const express = require("express");
const router = express.Router();

const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// =====================================
// Protected Routes
// =====================================

// Get all subjects
router.get(
  "/",
  authMiddleware,
  getSubjects
);

// Get single subject
router.get(
  "/:id",
  authMiddleware,
  getSubjectById
);

// =====================================
// Admin Only Routes
// =====================================

// Create subject
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createSubject
);

// Update subject
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateSubject
);

// Delete subject
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteSubject
);

module.exports = router;
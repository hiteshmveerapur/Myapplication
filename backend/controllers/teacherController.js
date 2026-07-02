const Teacher = require("../models/Teacher");

// ========================================
// Create Teacher
// ========================================

const createTeacher = async (req, res) => {
  try {
    const {
      teacherId,
      name,
      email,
      phone,
      department,
      designation,
      subjects,
      photo,
      userId,
    } = req.body;

    if (
      !teacherId ||
      !name ||
      !email ||
      !department ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Duplicate Teacher ID
    const existingTeacherId = await Teacher.findOne({
      teacherId,
    });

    if (existingTeacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID already exists.",
      });
    }

    // Duplicate Email
    const existingEmail = await Teacher.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const teacher = await Teacher.create({
      teacherId,
      name,
      email,
      phone,
      department,
      designation,
      subjects,
      photo,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully.",
      teacher,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create teacher.",
    });

  }
};

// ========================================
// Get All Teachers
// ========================================

const getTeachers = async (req, res) => {
  try {

    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const teachers = await Teacher.find(keyword)
      .populate("subjects", "subjectName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(teachers);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers.",
    });

  }
};

// ========================================
// Get Teacher By ID
// ========================================

const getTeacherById = async (req, res) => {
  try {

    const teacher = await Teacher.findById(
      req.params.id
    ).populate("subjects", "subjectName");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    res.status(200).json(teacher);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher.",
    });

  }
};

// ========================================
// Update Teacher
// ========================================

const updateTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findById(
      req.params.id
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    Object.assign(teacher, req.body);

    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully.",
      teacher,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update teacher.",
    });

  }
};

// ========================================
// Delete Teacher
// ========================================

const deleteTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findById(
      req.params.id
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    await teacher.deleteOne();

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete teacher.",
    });

  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
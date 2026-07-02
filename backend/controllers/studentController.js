const Student = require("../models/Student");

// ========================================
// Create Student
// ========================================

const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      phone,
      department,
      semester,
      section,
      userId,
    } = req.body;

    if (
      !studentId ||
      !name ||
      !email ||
      !department ||
      !semester
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check duplicate Student ID
    const existingStudentId = await Student.findOne({
      studentId,
    });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already exists.",
      });
    }

    // Check duplicate Email
    const existingEmail = await Student.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
      phone,
      department,
      semester,
      section,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      student,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create student.",
    });

  }
};

// ========================================
// Get All Students
// ========================================

const getStudents = async (req, res) => {
  try {

    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const students = await Student.find(keyword)
      .sort({
        createdAt: -1,
      });

    res.status(200).json(students);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
    });

  }
};

// ========================================
// Get Student By ID
// ========================================

const getStudentById = async (req, res) => {
  try {

    const student = await Student.findById(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json(student);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student.",
    });

  }
};

// ========================================
// Update Student
// ========================================

const updateStudent = async (req, res) => {
  try {

    const student = await Student.findById(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    Object.assign(student, req.body);

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      student,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update student.",
    });

  }
};

// ========================================
// Delete Student
// ========================================

const deleteStudent = async (req, res) => {
  try {

    const student = await Student.findById(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
    });

  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
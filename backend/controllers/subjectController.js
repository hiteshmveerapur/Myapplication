const Subject = require("../models/Subject");

// ========================================
// Create Subject
// ========================================

const createSubject = async (req, res) => {
  try {
    const {
      subjectCode,
      subjectName,
      department,
      semester,
      credits,
      teacherId,
    } = req.body;

    if (
      !subjectCode ||
      !subjectName ||
      !department ||
      !semester
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check duplicate subject code
    const existingCode = await Subject.findOne({
      subjectCode,
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: "Subject code already exists.",
      });
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      department,
      semester,
      credits,
      teacherId,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      subject,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create subject.",
    });

  }
};

// ========================================
// Get All Subjects
// ========================================

const getSubjects = async (req, res) => {
  try {

    const keyword = req.query.search
      ? {
          subjectName: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const subjects = await Subject.find(keyword)
      .populate(
        "teacherId",
        "name email teacherId"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(subjects);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects.",
    });

  }
};

// ========================================
// Get Subject By ID
// ========================================

const getSubjectById = async (req, res) => {
  try {

    const subject = await Subject.findById(
      req.params.id
    ).populate(
      "teacherId",
      "name email teacherId"
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    res.status(200).json(subject);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subject.",
    });

  }
};

// ========================================
// Update Subject
// ========================================

const updateSubject = async (req, res) => {
  try {

    const subject = await Subject.findById(
      req.params.id
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    Object.assign(subject, req.body);

    await subject.save();

    res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
      subject,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update subject.",
    });

  }
};

// ========================================
// Delete Subject
// ========================================

const deleteSubject = async (req, res) => {
  try {

    const subject = await Subject.findById(
      req.params.id
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete subject.",
    });

  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
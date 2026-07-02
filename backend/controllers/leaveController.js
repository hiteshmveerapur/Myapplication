const Leave = require("../models/Leave");
const Student = require("../models/Student"); // CRITICAL: Import the Student model!

// =========================================
// Apply Leave
// =========================================

const applyLeave = async (req, res) => {
  try {
    const {
      studentId, // This might be a User _id, a Student _id, or "STU007"
      fromDate,
      toDate,
      leaveType,
      reason,
      attachment,
    } = req.body;

    if (!studentId || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    // --- THE FIX: Find the TRUE Student ObjectId ---
    let studentRecord;
    
    // Check if the incoming ID is a valid MongoDB ObjectId format
    if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
      // It might be the Student _id OR the User _id. Search for both.
      studentRecord = await Student.findOne({ 
        $or: [{ _id: studentId }, { userId: studentId }] 
      });
    } else {
      // It's a text string like "STU007"
      studentRecord = await Student.findOne({ studentId: studentId });
    }

    // If we still can't find the student, reject the request
    if (!studentRecord) {
      return res.status(404).json({ 
        success: false, 
        message: "Could not match this to a valid Student record." 
      });
    }

    const validStudentObjectId = studentRecord._id;

    // Prevent duplicate leave request using the correct ID
    const existingLeave = await Leave.findOne({
      studentId: validStudentObjectId,
      fromDate,
      toDate,
      status: "Pending",
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        message: "A leave request for these dates already exists.",
      });
    }

    // Save using the genuine Student ObjectId
    const leave = await Leave.create({
      studentId: validStudentObjectId,
      fromDate,
      toDate,
      leaveType,
      reason,
      attachment,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully.",
      leave,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to apply leave.",
    });
  }
};

// =========================================
// Get All Leave Requests
// =========================================

const getLeaves = async (req, res) => {
  try {

    const filter = {};

    if (req.query.status)
      filter.status = req.query.status;

    if (req.query.studentId)
      filter.studentId =
        req.query.studentId;

    const leaves =
      await Leave.find(filter)
        .populate(
          "studentId",
          "name studentId department semester"
        )
        .populate(
          "approvedBy",
          "name teacherId"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(leaves);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch leave requests.",
    });

  }
};

// =========================================
// Student Leave History
// =========================================

const getStudentLeaves =
  async (req, res) => {
    try {

      const leaves =
        await Leave.find({
          studentId:
            req.params.studentId,
        })
          .populate(
            "approvedBy",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        leaves
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch leave history.",
      });

    }
  };

// =========================================
// Approve Leave
// =========================================

const approveLeave =
  async (req, res) => {
    try {

      const leave =
        await Leave.findById(
          req.params.id
        );

      if (!leave) {
        return res.status(404).json({
          success: false,
          message:
            "Leave request not found.",
        });
      }

      leave.status = "Approved";
      leave.approvedBy =
        req.user._id;
      leave.approvedOn =
        new Date();
      leave.remarks =
        req.body.remarks || "";

      await leave.save();

      res.status(200).json({
        success: true,
        message:
          "Leave approved successfully.",
        leave,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to approve leave.",
      });

    }
  };

// =========================================
// Reject Leave
// =========================================

const rejectLeave =
  async (req, res) => {
    try {

      const leave =
        await Leave.findById(
          req.params.id
        );

      if (!leave) {
        return res.status(404).json({
          success: false,
          message:
            "Leave request not found.",
        });
      }

      leave.status = "Rejected";
      leave.approvedBy =
        req.user._id;
      leave.approvedOn =
        new Date();
      leave.remarks =
        req.body.remarks || "";

      await leave.save();

      res.status(200).json({
        success: true,
        message:
          "Leave rejected successfully.",
        leave,
      });

    } catch (error) {

      console.error("FULL ERROR:", error);
      console.error("MESSAGE:", error.message);
      console.error("ERRORS:", error.errors);

      res.status(500).json({
        success: false,
        message:
          "Failed to reject leave.",
      });

    }
  };

// =========================================
// Leave Statistics
// =========================================

const getLeaveStatistics =
  async (req, res) => {
    try {

      const total =
        await Leave.countDocuments();

      const pending =
        await Leave.countDocuments({
          status: "Pending",
        });

      const approved =
        await Leave.countDocuments({
          status: "Approved",
        });

      const rejected =
        await Leave.countDocuments({
          status: "Rejected",
        });

      res.status(200).json({
        success: true,
        total,
        pending,
        approved,
        rejected,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch leave statistics.",
      });

    }
  };

module.exports = {
  applyLeave,
  getLeaves,
  getStudentLeaves,
  approveLeave,
  rejectLeave,
  getLeaveStatistics,
};
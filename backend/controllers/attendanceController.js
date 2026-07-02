const Attendance = require("../models/Attendance");

// =========================================
// Mark Attendance
// =========================================

const markAttendance = async (req, res) => {
  try {
    const {
      studentId,
      subjectId,
      teacherId,
      status,
      remarks,
      attendanceMethod,
      deviceInfo,
      ipAddress,
    } = req.body;

    if (
      !studentId ||
      !subjectId ||
      !teacherId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    // Today's date (ignore time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Prevent duplicate attendance
    const alreadyMarked =
      await Attendance.findOne({
        studentId,
        subjectId,
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      });

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance already marked for today.",
      });
    }

    const attendance =
      await Attendance.create({
        studentId,
        subjectId,
        teacherId,
        status,
        remarks,
        attendanceMethod:
          attendanceMethod || "Manual",
        deviceInfo: deviceInfo || "",
        ipAddress: ipAddress || "",
      });

    res.status(201).json({
      success: true,
      message:
        "Attendance marked successfully.",
      attendance,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to mark attendance.",
    });

  }
};

// =========================================
// Get Attendance
// =========================================

const getAttendance = async (req, res) => {
  try {

    const filter = {};

    if (req.query.studentId)
      filter.studentId =
        req.query.studentId;

    if (req.query.teacherId)
      filter.teacherId =
        req.query.teacherId;

    if (req.query.subjectId)
      filter.subjectId =
        req.query.subjectId;

    if (req.query.status)
      filter.status =
        req.query.status;

    const attendance =
      await Attendance.find(filter)
        .populate(
          "studentId",
          "name studentId department semester"
        )
        .populate(
          "subjectId",
          "subjectName subjectCode"
        )
        .populate(
          "teacherId",
          "name teacherId"
        )
        .sort({
          date: -1,
        });

    res.status(200).json(attendance);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch attendance.",
    });

  }
};

// =========================================
// Student Attendance
// =========================================

const getAttendanceByStudent =
  async (req, res) => {
    try {

      const attendance =
        await Attendance.find({
          studentId:
            req.params.studentId,
        })
          .populate(
            "subjectId",
            "subjectName subjectCode"
          )
          .populate(
            "teacherId",
            "name teacherId"
          )
          .sort({
            date: -1,
          });

      res.status(200).json(
        attendance
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch student attendance.",
      });

    }
  };

// =========================================
// Attendance Percentage
// =========================================

const getAttendancePercentage =
  async (req, res) => {
    try {

      const studentId =
        req.params.studentId;

      const total =
        await Attendance.countDocuments({
          studentId,
        });

      const present =
        await Attendance.countDocuments({
          studentId,
          status: "Present",
        });

      const absent =
        await Attendance.countDocuments({
          studentId,
          status: "Absent",
        });

      const late =
        await Attendance.countDocuments({
          studentId,
          status: "Late",
        });

      const percentage =
        total === 0
          ? 0
          : (
              (present / total) *
              100
            ).toFixed(2);

      res.status(200).json({
        success: true,
        totalClasses: total,
        present,
        absent,
        late,
        attendancePercentage:
          percentage + "%",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to calculate attendance.",
      });

    }
  };

module.exports = {
  markAttendance,
  getAttendance,
  getAttendanceByStudent,
  getAttendancePercentage,
};
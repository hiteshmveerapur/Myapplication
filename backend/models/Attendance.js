const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    attendanceMethod: {
      type: String,
      enum: ["Manual", "QR"],
      default: "Manual",
    },

    deviceInfo: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// Prevent duplicate attendance
// One student -> One subject -> One day
// ======================================

attendanceSchema.index(
  {
    studentId: 1,
    subjectId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// ======================================
// Faster Queries
// ======================================

attendanceSchema.index({
  studentId: 1,
});

attendanceSchema.index({
  teacherId: 1,
});

attendanceSchema.index({
  subjectId: 1,
});

attendanceSchema.index({
  date: -1,
});

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);
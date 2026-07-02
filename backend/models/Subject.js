const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },

    credits: {
      type: Number,
      default: 3,
      min: 1,
      max: 10,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================
// Database Indexes
// ============================

subjectSchema.index({
  subjectCode: 1,
});

subjectSchema.index({
  department: 1,
});

subjectSchema.index({
  semester: 1,
});

subjectSchema.index({
  subjectName: 1,
});

module.exports = mongoose.model(
  "Subject",
  subjectSchema
);
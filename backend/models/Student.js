const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email",
      ],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
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

    section: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    qrCode: {
      type: String,
      default: "",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// -------------------------
// Indexes
// -------------------------

studentSchema.index({
  studentId: 1,
});

studentSchema.index({
  email: 1,
});

studentSchema.index({
  department: 1,
});

module.exports = mongoose.model(
  "Student",
  studentSchema
);
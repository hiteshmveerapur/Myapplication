const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: [true, "Teacher name is required"],
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

    designation: {
      type: String,
      default: "Assistant Professor",
      trim: true,
    },

    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],

    photo: {
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

// ===============================
// Database Indexes
// ===============================

teacherSchema.index({
  teacherId: 1,
});

teacherSchema.index({
  email: 1,
});

teacherSchema.index({
  department: 1,
});

teacherSchema.index({
  designation: 1,
});

module.exports = mongoose.model(
  "Teacher",
  teacherSchema
);
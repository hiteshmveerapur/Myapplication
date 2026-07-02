const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
      index: true,
    },

    fromDate: {
      type: Date,
      required: [true, "From date is required"],
    },

    toDate: {
      type: Date,
      required: [true, "To date is required"],
    },

    totalDays: {
      type: Number,
      default: 1,
    },

    leaveType: {
      type: String,
      enum: [
        "Medical",
        "Personal",
        "Emergency",
        "Academic",
        "Other",
      ],
      default: "Personal",
    },

    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
      maxlength: 500,
    },

    attachment: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    approvedOn: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ================================
// Validation
// ================================

leaveSchema.pre("save", function () {

  if (this.toDate < this.fromDate) {
    throw new Error(
      "To Date cannot be before From Date."
    );
  }

  const diff =
    Math.ceil(
      (this.toDate - this.fromDate) /
      (1000 * 60 * 60 * 24)
    ) + 1;

  this.totalDays = diff;

});

// ================================
// Indexes
// ================================

leaveSchema.index({
  studentId: 1,
  createdAt: -1,
});

leaveSchema.index({
  status: 1,
});

module.exports = mongoose.model(
  "Leave",
  leaveSchema
);
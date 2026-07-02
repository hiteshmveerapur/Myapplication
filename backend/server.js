require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const subjectRoutes = require("./routes/subject");
const attendanceRoutes = require("./routes/attendance");
const leaveRoutes = require("./routes/leave");
const uploadRoutes = require("./routes/upload");

const app = express();

const PORT = process.env.PORT || 5000;

// Better DNS support
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// MongoDB Connection
// ===============================

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI not found in .env file."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(
      "MongoDB Connection Failed"
    );
    console.error(error.message);

    process.exit(1);
  }
};

connectDB();

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Smart Attendance Management System API is Running",
  });
});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);

app.use("/api/upload", uploadRoutes);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ===============================
// Global Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// Server
// ===============================

app.listen(PORT, () => {
  console.log(
    `Server Running Successfully on Port ${PORT}`
  );
});
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// Verify JWT Token
// ==========================================

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login first.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user =
      await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });

  }
};

// ==========================================
// Role Authorization
// ==========================================

const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();

  };

};

module.exports = {
  authMiddleware,
  authorizeRoles,
};
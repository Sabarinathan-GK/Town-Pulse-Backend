
const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware
const {
  protect,
  authorize,
} = require("./middleware/authMiddleware");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TownPulse backend is running!",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Protected test API
app.get("/api/auth/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Admin-only test API
app.get(
  "/api/admin/dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Admin Dashboard",
      user: req.user.fullName,
    });
  }
);

// Handle unknown routes (must be last)
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;

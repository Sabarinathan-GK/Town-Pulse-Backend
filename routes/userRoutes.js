
const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getSavedEvents,
  addSavedEvent,
  removeSavedEvent,
  getMyEvents,
  getDashboardStats,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Profile APIs
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Saved events APIs
router.get("/saved-events", protect, getSavedEvents);
router.post("/saved-events/:eventId", protect, addSavedEvent);
router.delete("/saved-events/:eventId", protect, removeSavedEvent);

// My events and dashboard
router.get("/my-events", protect, getMyEvents);
router.get("/dashboard-stats", protect, getDashboardStats);

module.exports = router;

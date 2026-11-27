
const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getDashboardStats,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect, authorize } = require("../middleware/authMiddleware");
const {
  validateEvent,
} = require("../middleware/validationMiddleware");


// Public APIs
router.get("/", getEvents);
router.get(
  "/admin/stats",
  protect,
  authorize("admin"),
  getDashboardStats
);
router.get("/:id", getEventById);

// Admin-only APIs
router.post(
  "/",
  protect,
  authorize("admin"),
  validateEvent,
  createEvent
);
router.put("/:id", protect, authorize("admin"), updateEvent);
router.delete("/:id", protect, authorize("admin"), deleteEvent);

module.exports = router;

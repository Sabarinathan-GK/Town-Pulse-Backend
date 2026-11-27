
const User = require("../models/User");
const Event = require("../models/Event");

// Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, location, bio, profileImage } = req.body;

    const updates = {};

    if (fullName !== undefined) updates.fullName = fullName;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (profileImage !== undefined) updates.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get saved events
const getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("savedEvents");

    res.status(200).json({
      success: true,
      savedEvents: user.savedEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved events",
    });
  }
};

// Save an event
const addSavedEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedEvents: eventId },
    });

    res.status(200).json({
      success: true,
      message: "Event saved successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to save event. Check the event ID.",
    });
  }
};

// Remove a saved event
const removeSavedEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedEvents: eventId },
    });

    res.status(200).json({
      success: true,
      message: "Event removed from saved list",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to remove saved event",
    });
  }
};


// Get events created by logged-in user
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalEvents: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your events",
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const savedEventsCount = await User.findById(userId)
      .select("savedEvents");

    const createdEventsCount = await Event.countDocuments({
      createdBy: userId,
    });

    res.status(200).json({
      success: true,
      stats: {
        savedEvents: savedEventsCount.savedEvents.length,
        createdEvents: createdEventsCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  getSavedEvents,
  addSavedEvent,
  removeSavedEvent,
  getMyEvents,
  getDashboardStats
};

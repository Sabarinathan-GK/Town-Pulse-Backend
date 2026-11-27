
const Event = require("../models/Event");

// Create event
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      priceCategory,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (priceCategory) {
      filter.priceCategory = priceCategory;
    }

    if (search) {
      filter.eventName = {
        $regex: search,
        $options: "i",
      };
    }

    if (req.query.recommended === "true") {
      filter.recommended = true;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));

    let sort = { createdAt: -1 };

    if (sortBy === "date") {
      sort = { dateTime: 1 };
    } else if (sortBy === "priceLowToHigh") {
      sort = { price: 1 };
    } else if (sortBy === "priceHighToLow") {
      sort = { price: -1 };
    } else if (sortBy === "popularity") {
      sort = { interestedPeopleCount: -1 };
    }

    const totalEvents = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      totalEvents,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalEvents / limitNumber),
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};



// Get Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    const result = await Event.aggregate([
      {
        $group: {
          _id: null,

          totalEvents: {
            $sum: 1,
          },

          upcomingEvents: {
            $sum: {
              $cond: [
                { $gte: ["$dateTime", now] },
                1,
                0,
              ],
            },
          },

          freeEvents: {
            $sum: {
              $cond: [
                { $eq: ["$priceCategory", "Free"] },
                1,
                0,
              ],
            },
          },

          paidEvents: {
            $sum: {
              $cond: [
                { $eq: ["$priceCategory", "Paid"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEvents: 1,
          upcomingEvents: 1,
          freeEvents: 1,
          paidEvents: 1,
        },
      },
    ]);

    const stats = result[0] || {
      totalEvents: 0,
      upcomingEvents: 0,
      freeEvents: 0,
      paidEvents: 0,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};


// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID",
    });
  }
};

// Update event

const updateEvent = async (req, res) => {
  try {
    const allowedFields = [
      "eventName",
      "description",
      "category",
      "dateTime",
      "location",
      "price",
      "priceCategory",
      "bannerImage",
      "coverImage",
      "eventTags",
      "featured",
      "recommended",
      "organizedBy",
    ];

    // Keep only allowed fields
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID",
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getDashboardStats,
};

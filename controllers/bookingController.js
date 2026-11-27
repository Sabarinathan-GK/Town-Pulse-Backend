
const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { eventId, ticketQuantity } = req.body;

    // Validate input
    if (!eventId || !Number.isInteger(ticketQuantity) ||
        ticketQuantity < 1 || ticketQuantity > 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid event ID and ticket quantity (1-10)",
      });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check event date
    if (new Date(event.dateTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Tickets cannot be booked for past events",
      });
    }

    const ticketPrice = Number(event.price) || 0;
    const totalAmount = ticketPrice * ticketQuantity;

    // Free events are confirmed immediately.
    // Paid bookings remain pending until payment integration.
    const isFree = ticketPrice === 0;

    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      ticketQuantity,
      ticketPrice,
      totalAmount,
      bookingStatus: isFree ? "Confirmed" : "Pending",
      paymentStatus: isFree ? "Free" : "Pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("event", "eventName dateTime location bannerImage price");

    return res.status(201).json({
      success: true,
      message: isFree
        ? "Free tickets booked successfully"
        : "Booking created. Payment is pending",
      booking: populatedBooking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("event", "eventName dateTime location bannerImage price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a specific booking belonging to the logged-in user
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("event");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
};


const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
    },

    category: {
      type: String,
      required: [true, "Event category is required"],
      trim: true,
    },

    dateTime: {
      type: Date,
      required: [true, "Event date and time are required"],
    },

    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    priceCategory: {
      type: String,
      enum: ["Free", "Paid"],
      default: "Free",
    },

    bannerImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    eventTags: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    recommended: {
      type: Boolean,
      default: false,
    },

    interestedPeopleCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    organizedBy: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

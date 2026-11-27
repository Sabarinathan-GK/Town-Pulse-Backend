
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        ticketQuantity: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },

        ticketPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        bookingStatus: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Free"],
            default: "Pending",
        },

        bookingDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", bookingSchema);

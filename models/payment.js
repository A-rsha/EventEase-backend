const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "NetBanking"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },

    transactionId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
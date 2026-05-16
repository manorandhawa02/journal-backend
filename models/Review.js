const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper",
    required: true
  },

  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  comment: {
    type: String,
    required: true
  },

  decision: {
    type: String,
    enum: ["minor revision", "major revision", "accepted", "rejected"],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
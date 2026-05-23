const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    commentsToAuthor: {
      type: String,
      default: "",
    },

    confidentialComments: {
      type: String,
    },

    recommendation: {
  type: String,
  enum: ["Accept", "Minor Revision", "Major Revision", "Reject"],
  default: "Minor Revision",
},

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    status: {
      type: String,
      enum: ["Pending", "Submitted"],
      default: "Pending",
    },

    submittedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
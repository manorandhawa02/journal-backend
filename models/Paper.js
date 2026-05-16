const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    // required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  fileUrl: {
    type: String ,// for later (PDF link)
    required: true

  },
  consentGiven: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    enum: ["submitted", "under review", "accepted", "rejected"],
    default: "under review"
  }
}, { timestamps: true });

module.exports = mongoose.model("Paper", paperSchema);
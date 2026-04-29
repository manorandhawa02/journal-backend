const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  pdfUrl: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Journal", journalSchema);
const mongoose = require("mongoose");

const publishedPaperSchema = new mongoose.Schema(
  {
    title: String,

    authors: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

    abstract: String,

    fileUrl: String,

    volume: Number,

    issue: Number,

    doi: String,

    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PublishedPaper",
  publishedPaperSchema
);
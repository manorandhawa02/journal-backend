const mongoose = require("mongoose");

const publishedPaperSchema = new mongoose.Schema(
  {
    title: String,

    authors: [String],

    abstract: String,

    fileUrl: String,

    doi: String,
    category: String,

    volume: {
      type: Number,
      default: 1,
    },

    issue: {
      type: Number,
      default: 1,
    },

    issueTitle: {
      type: String,
      default: "Regular Issue",
    },

    category: {
      type: String,
      default: "Computer Science",
    },

    pages: String,

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
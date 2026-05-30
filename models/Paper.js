const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    title: String,

    abstract: String,

    // ✅ ADD THIS
    authorName: String,

    keywords: [String],
    journalCategory: {
      type: String,
      default: "Computer Science",
    },

    // ✅ uploaded pdf url
    fileUrl: String,

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedReviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Initial Screening",
        "Under Review",
        "Minor Revision",
        "Major Revision",
        "Accepted",
        "Rejected",
        "Published",
      ],
      default: "Submitted",
    },

    revisionRound: {
      type: Number,
      default: 0,
    },

    versions: [
      {
        version: Number,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        comment: String,
      },
    ],

    timeline: [
      {
        action: String,

        date: {
          type: Date,
          default: Date.now,
        },

        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    editorDecision: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Revision"],
      default: "Pending",
    },

    blindReviewEnabled: {
      type: Boolean,
      default: true,
    },

    publishedAt: Date,

    doi: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Paper", paperSchema);

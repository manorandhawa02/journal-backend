const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "author", "reviewer"],
      default: "author",
    },

    // ✅ NEW
    orcid: {
      type: String,
      default: "",
    },

    // ✅ NEW
    journalCategory: {
      type: String,
      enum: [
        "Artificial Intelligence",
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Cyber Security",
        "Healthcare",
        "Blockchain",
        "IoT",
        "Cloud Computing",
      ],
      default: "Computer Science",
    },

    // ✅ FUTURE GOOGLE LOGIN
    googleId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
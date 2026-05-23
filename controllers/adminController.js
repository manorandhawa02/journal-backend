const User = require("../models/User");
const Paper = require("../models/Paper");
const Review = require("../models/Review");

// ================= REVIEWERS =================
exports.getReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ role: "reviewer" }).select(
      "_id name email"
    );

    res.json(reviewers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.assignReviewers = async (req, res) => {
  try {
    const { reviewerIds } = req.body;

    console.log("BODY:", req.body); // 🔥 DEBUG LINE

    if (!reviewerIds || reviewerIds.length === 0) {
      return res.status(400).json({
        message: "Reviewer not selected",
      });
    }

    const paper = await require("../models/Paper").findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    paper.reviewers = reviewerIds;

    paper.status = "Under Review";

    paper.timeline.push({
      action: "Reviewers Assigned",
      by: req.user.id,
    });

    await paper.save();

    res.json({
      message: "Reviewer assigned successfully",
      paper,
    });
  } catch (error) {
    console.log("ASSIGN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DASHBOARD STATS =================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPapers = await Paper.countDocuments();

    const acceptedPapers = await Paper.countDocuments({
      status: "Accepted",
    });

    const rejectedPapers = await Paper.countDocuments({
      status: "Rejected",
    });

    const underReviewPapers = await Paper.countDocuments({
      status: "Under Review",
    });

    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers,
      totalPapers,
      acceptedPapers,
      rejectedPapers,
      underReviewPapers,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
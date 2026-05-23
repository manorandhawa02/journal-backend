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

    paper.assignedReviewers = reviewerIds;

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

exports.getAuthorStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Paper.countDocuments({ submittedBy: userId });
    const underReview = await Paper.countDocuments({
      submittedBy: userId,
      status: "Under Review",
    });

    const accepted = await Paper.countDocuments({
      submittedBy: userId,
      status: "Accepted",
    });

    const rejected = await Paper.countDocuments({
      submittedBy: userId,
      status: "Rejected",
    });

    res.json({ total, underReview, accepted, rejected });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAdminStats = async (req, res) => {
  try {
    const total = await Paper.countDocuments();

    const submitted = await Paper.countDocuments({ status: "Submitted" });
    const underReview = await Paper.countDocuments({ status: "Under Review" });
    const minor = await Paper.countDocuments({ status: "Minor Revision" });
    const major = await Paper.countDocuments({ status: "Major Revision" });
    const accepted = await Paper.countDocuments({ status: "Accepted" });
    const rejected = await Paper.countDocuments({ status: "Rejected" });
    const published = await Paper.countDocuments({ status: "Published" });

    res.json({
      total,
      submitted,
      underReview,
      minor,
      major,
      accepted,
      rejected,
      published,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
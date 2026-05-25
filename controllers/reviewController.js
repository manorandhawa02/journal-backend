const Paper = require("../models/Paper");
const Review = require("../models/Review");
const User = require("../models/User");

// ======================================================
// ASSIGN REVIEWER TO PAPER
// ======================================================
exports.assignReviewer = async (req, res) => {
  try {
    const { reviewerId } = req.body;
    const paperId = req.params.id;

    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // ensure arrays exist
    paper.assignedReviewers = paper.assignedReviewers || [];
    paper.reviews = paper.reviews || [];

    // avoid duplicates
    if (!paper.assignedReviewers.includes(reviewerId)) {
      paper.assignedReviewers.push(reviewerId);
    }

    // ✅ CREATE REVIEW (THIS WAS MISSING)
    const review = await Review.create({
      paper: paper._id,
      reviewer: reviewerId,
      commentsToAuthor: "",
      confidentialComments: "",
      recommendation: "",
      rating: 1,
      status: "Pending",
    });

    // link review to paper
    paper.reviews.push(review._id);

    paper.status = "Under Review";

    await paper.save();

    await paper.populate("assignedReviewers", "name email");

    return res.json({
      message: "Reviewer assigned successfully",
      paper,
    });
  } catch (error) {
    console.error("ASSIGN REVIEWER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ======================================================
// SUBMIT REVIEW
// ======================================================
exports.submitReview = async (req, res) => {
  try {
    const paperId = req.params.id;

    const { commentsToAuthor, confidentialComments, recommendation, rating } =
      req.body;

    const review = await Review.findOne({
      paper: paperId,
      reviewer: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review record not found. Paper not properly assigned.",
      });
    }

    // Update review fields
    review.commentsToAuthor = commentsToAuthor;
    review.confidentialComments = confidentialComments;
    review.recommendation = recommendation;
    review.rating = rating;
    review.status = "Submitted";
    review.submittedAt = new Date();

    await review.save();

    // Update paper based on review
    const paper = await Paper.findById(paperId);

    if (recommendation === "Accept") {
      paper.status = "Accepted";
    } else if (recommendation === "Reject") {
      paper.status = "Rejected";
    } else if (recommendation === "Minor Revision") {
      paper.status = "Minor Revision";
    } else if (recommendation === "Major Revision") {
      paper.status = "Major Revision";
    }

    paper.timeline = paper.timeline || [];
    paper.timeline.push({
      action: `Reviewer recommendation: ${recommendation}`,
      by: req.user.id,
      date: new Date(),
    });

    await paper.save();

    return res.json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("SUBMIT REVIEW ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ======================================================
// GET PAPERS ASSIGNED TO REVIEWER
// ======================================================
exports.getAssignedPapers = async (req, res) => {
  try {
    const papers = await Paper.find({
      assignedReviewers: { $in: [req.user.id] }
    }).populate("submittedBy");

    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

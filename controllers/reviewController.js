const Paper = require("../models/Paper");
const Review = require("../models/Review");
const User = require("../models/User");

// ================= ASSIGN REVIEWER =================
exports.assignReviewer = async (req, res) => {
  try {
    const { reviewerId } = req.body;

    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // add reviewer if not already assigned
    if (!paper.assignedReviewers.includes(reviewerId)) {
      paper.assignedReviewers.push(reviewerId);
    }

    // create review record
    const review = await Review.create({
      paper: paper._id,
      reviewer: reviewerId,
      status: "Pending",
    });

    paper.reviews.push(review._id);

    await paper.save();

    res.json({
      message: "Reviewer assigned successfully",
      paper,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= SUBMIT REVIEW =================


exports.submitReview = async (req, res) => {
  try {
    const { commentsToAuthor, confidentialComments, recommendation, rating } =
      req.body;

    const review = await Review.findOne({
      paper: req.params.id,
      reviewer: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.commentsToAuthor = commentsToAuthor;
    review.confidentialComments = confidentialComments;
    review.recommendation = recommendation;
    review.rating = rating;
    review.status = "Submitted";
    review.submittedAt = new Date();

    await review.save();

    res.json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= Get Assigned papers =================

exports.getAssignedPapers = async (req, res) => {
  try {
    const papers = await Paper.find({
      assignedReviewers: req.user.id,
    }).populate("author", "name email");

    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



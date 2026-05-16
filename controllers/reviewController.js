const Review = require("../models/Review");


// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { comment, decision } = req.body;

    const review = await Review.create({
      paper: req.params.paperId,
      reviewer: req.user.id,
      comment,
      decision
    });

    res.status(201).json({
      message: "Review added successfully",
      review
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// GET REVIEWS OF PAPER
exports.getReviewsByPaper = async (req, res) => {
  try {
    const reviews = await Review.find({
      paper: req.params.paperId
    })
    .populate("reviewer", "name email role")
    .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
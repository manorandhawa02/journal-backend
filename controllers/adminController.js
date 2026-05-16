const User = require("../models/User");
const Paper = require("../models/Paper");
const Review = require("../models/Review");


// ADMIN STATS
exports.getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalPapers = await Paper.countDocuments();

    const acceptedPapers = await Paper.countDocuments({
      status: "accepted"
    });

    const rejectedPapers = await Paper.countDocuments({
      status: "rejected"
    });

    const underReviewPapers = await Paper.countDocuments({
      status: "under review"
    });

    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers,
      totalPapers,
      acceptedPapers,
      rejectedPapers,
      underReviewPapers,
      totalReviews
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
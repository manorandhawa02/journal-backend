const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  addReview,
  getReviewsByPaper
} = require("../controllers/reviewController");


// Reviewer adds review
router.post(
  "/:paperId",
  protect,
  authorizeRoles("reviewer", "admin"),
  addReview
);


// Anyone logged in can view reviews
router.get(
  "/:paperId",
  protect,
  getReviewsByPaper
);

module.exports = router;
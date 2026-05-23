const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  assignReviewer,
  submitReview,
  getAssignedPapers,
} = require("../controllers/reviewController");

// ADMIN assigns reviewer
router.post(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignReviewer
);

// REVIEWER submits review
router.post(
  "/:id/submit",
  protect,
  authorizeRoles("reviewer"),
  submitReview
);

// REVIEWER dashboard
router.get(
  "/assigned",
  protect,
  authorizeRoles("reviewer"),
  getAssignedPapers
);


router.get("/assigned", protect, authorizeRoles("reviewer"), getAssignedPapers);

module.exports = router;
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  getDashboardStats,
  getReviewers,
} = require("../controllers/adminController");

// ================= STATS =================
router.get("/stats", protect, authorizeRoles("admin"), getDashboardStats);


// ================= REVIEWERS =================
router.get(
  "/reviewers",
  protect,
  authorizeRoles("admin"),
  getReviewers
);


const {
  getAdminStats,
  getAuthorStats,
} = require("../controllers/adminController");

router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

router.get("/author-stats", protect, getAuthorStats);

module.exports = router;
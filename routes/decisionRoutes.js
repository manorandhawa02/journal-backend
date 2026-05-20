const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  getReviewSummary,
  suggestDecision,
  finalDecision,
} = require("../controllers/decisionController");

// ================= EDITOR DASHBOARD =================
router.get(
  "/:id/summary",
  protect,
  authorizeRoles("admin"),
  getReviewSummary
);

// ================= AI-STYLE SUGGESTION =================
router.get(
  "/:id/suggest",
  protect,
  authorizeRoles("admin"),
  suggestDecision
);

// ================= FINAL DECISION =================
router.put(
  "/:id/final",
  protect,
  authorizeRoles("admin"),
  finalDecision
);

module.exports = router;
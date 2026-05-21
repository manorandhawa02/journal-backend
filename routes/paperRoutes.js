const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { submitRevision } = require("../controllers/paperController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  uploadPaper,
  getAllPapers,
  getMyPapers,
  getPaperById,
  acceptPaper,
  rejectPaper,
  moveToReview
} = require("../controllers/paperController");

// ================= AUTHOR =================
router.post("/submit", protect, upload.single("file"), uploadPaper);
router.get("/my", protect, getMyPapers);

// ================= GENERAL =================
router.get("/", protect, getAllPapers);
router.get("/:id", protect, getPaperById);

// ================= EDITORIAL WORKFLOW =================

// Move to review stage (EDITOR action)
router.put(
  "/:id/review",
  protect,
  authorizeRoles("admin", "reviewer"),
  moveToReview
);

// Accept paper (final decision)
router.put(
  "/:id/accept",
  protect,
  authorizeRoles("admin"),
  acceptPaper
);

// Reject paper (final decision)
router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectPaper
);

// Revision
router.put(
  "/:id/revision",
  protect,
  upload.single("file"),
  submitRevision
);

module.exports = router;
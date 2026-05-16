const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  uploadPaper,
  getAllPapers,
  getMyPapers,
  getPaperById,
  acceptPaper,
  rejectPaper
} = require("../controllers/paperController");

router.post("/submit", protect, upload.single("file"), uploadPaper);

router.get("/", protect, getAllPapers);
router.get("/my", protect, getMyPapers);
router.get("/:id", protect, getPaperById);

router.put(
  "/:id/accept",
  protect,
  authorizeRoles("reviewer", "author", "admin"),
  acceptPaper
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("reviewer", "author", "admin"),
  rejectPaper
);

module.exports = router;
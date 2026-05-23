const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  publishPaper,
  getPublishedPapers,
  getPublishedPaperById,
} = require("../controllers/publishedController");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

// ================= PUBLISH =================
router.post(
  "/publish/:id",
  protect,
  authorizeRoles("admin"),
  publishPaper
);

// ================= GET ALL =================
router.get(
  "/",
  protect,
  getPublishedPapers
);

// ================= GET SINGLE =================
router.get(
  "/:id",
  protect,
  getPublishedPaperById
);

module.exports = router;
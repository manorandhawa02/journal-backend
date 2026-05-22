const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  publishPaper,
  getPublishedPapers,
  getPublishedPaperById,
} = require("../controllers/publishedController");

// publish (admin/editor only)
router.post(
  "/publish/:id",
  protect,
  authorizeRoles("admin", "editor"),
  publishPaper
);

// get all published
router.get("/", protect, getPublishedPapers);

// get single published
router.get("/:id", protect, getPublishedPaperById);

module.exports = router;
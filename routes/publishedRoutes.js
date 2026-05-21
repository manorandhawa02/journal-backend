const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  publishPaper,
  getPublishedPapers,
  getPublishedPaperById,
} = require("../controllers/publishedController");


// ================= PUBLISH PAPER (EDITOR ONLY) =================
router.post(
  "/publish/:id",
  protect,
  authorizeRoles("admin", "editor"),
  publishPaper
);


// ================= GET ALL PUBLISHED PAPERS =================
router.get(
  "/",
  protect,
  getPublishedPapers
);


// ================= GET SINGLE PUBLISHED PAPER =================
router.get(
  "/:id",
  protect,
  getPublishedPaperById
);

module.exports = router;
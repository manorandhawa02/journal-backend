const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  getDashboardStats
} = require("../controllers/adminController");


// ADMIN DASHBOARD
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

module.exports = router;
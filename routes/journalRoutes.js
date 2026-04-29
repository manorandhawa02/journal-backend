const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createJournal,
  getJournals,
  approveJournal
} = require("../controllers/journalController");

router.post("/", protect, createJournal);
router.get("/", getJournals);
router.put("/:id/approve", protect, approveJournal);

module.exports = router;
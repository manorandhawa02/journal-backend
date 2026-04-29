const Journal = require("../models/Journal");

// Create Journal
exports.createJournal = async (req, res) => {
  try {
    const journal = await Journal.create({
      ...req.body,
      author: req.user.id
    });

    res.json(journal);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Get All Journals
exports.getJournals = async (req, res) => {
  const journals = await Journal.find().populate("author", "name email");
  res.json(journals);
};

// Approve Journal (Admin only)
exports.approveJournal = async (req, res) => {
  const journal = await Journal.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  res.json(journal);
};
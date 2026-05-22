const PublishedPaper = require("../models/PublishedPaper");
const Paper = require("../models/Paper");

// ================= PUBLISH PAPER =================
exports.publishPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // IMPORTANT: keep status consistent (use CAPITAL letters everywhere)
    if (paper.status !== "Accepted") {
      return res.status(400).json({
        message: "Only accepted papers can be published",
      });
    }

    const published = await PublishedPaper.create({
      title: paper.title,
      abstract: paper.abstract,
      fileUrl: paper.fileUrl,
      authors: [paper.author],
      volume: req.body.volume || 1,
      issue: req.body.issue || 1,
      doi: `10.1000/journal.${Date.now()}`,
    });

    paper.status = "Published";
    await paper.save();

    res.json({
      message: "Paper published successfully",
      published,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET ALL =================
exports.getPublishedPapers = async (req, res) => {
  try {
    const papers = await PublishedPaper.find().sort({ publishedAt: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET BY ID =================
exports.getPublishedPaperById = async (req, res) => {
  try {
    const paper = await PublishedPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
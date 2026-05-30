const PublishedPaper = require("../models/PublishedPaper");
const Paper = require("../models/Paper");

// ================= PUBLISH PAPER =================
exports.publishPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        message: "Paper not found",
      });
    }

    // ONLY ACCEPTED PAPERS CAN BE PUBLISHED
    if (paper.status !== "Accepted") {
      return res.status(400).json({
        message: "Only accepted papers can be published",
      });
    }

    const lastPaper = await PublishedPaper.findOne().sort({ createdAt: -1 });

    let volume = 1;
    let issue = 1;

    if (lastPaper) {
      volume = lastPaper.volume;
      issue = lastPaper.issue;
    }

    // CREATE PUBLISHED PAPER
    const published = await PublishedPaper.create({
      title: paper.title,

      abstract: paper.abstract,

      fileUrl: paper.fileUrl,

      // ✅ FIXED
      authors: [paper.authorName],

      volume: req.body.volume || 1,

      issue: req.body.issue || 1,

      doi: `10.5678/GSJP.${new Date().getFullYear()}.${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
      category: "Computer Science",
    });

    // UPDATE STATUS
    paper.status = "Published";
    paper.timeline.push({
      action: "Published",
      by: req.user.id,
    });

    paper.publishedAt = new Date();

    await paper.save();

    res.json({
      message: "Paper published successfully",
      published,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ================= GET ALL =================
exports.getPublishedPapers = async (req, res) => {
  try {
    const papers = await PublishedPaper.find().sort({ createdAt: -1 });

    res.json(papers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SINGLE =================
exports.getPublishedPaperById = async (req, res) => {
  try {
    const paper = await PublishedPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        message: "Paper not found",
      });
    }

    res.json(paper);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

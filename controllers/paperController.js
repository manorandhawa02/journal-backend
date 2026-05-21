const cloudinary = require("../config/cloudinary");
const Paper = require("../models/Paper");


// ================= UPLOAD PAPER =================
exports.uploadPaper = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const { title, abstract, consentGiven, keywords } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    const paper = await Paper.create({
      title,
      abstract,
      keywords: keywords ? keywords.split(",") : [],
      consentGiven,
      author: req.user.id,
      fileUrl: result.secure_url,

      // 🔥 ADD WORKFLOW CORE
      status: "Submitted",
      revisionRound: 0,
      timeline: [
        {
          action: "Paper Submitted",
          by: req.user.id,
        },
      ],
    });

    res.status(201).json({
      message: "Paper uploaded successfully",
      paper,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ALL PAPERS =================
exports.getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find()
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.json(papers);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// ================= GET MY PAPERS =================
exports.getMyPapers = async (req, res) => {
  try {
    const papers = await Paper.find({
      author: req.user.id
    }).sort({ createdAt: -1 });

    res.json(papers);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// ================= GET SINGLE PAPER =================
exports.getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate("author", "name email role");

    if (!paper) {
      return res.status(404).json({
        message: "Paper not found"
      });
    }

    res.json(paper);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
// ACCEPT PAPER
exports.acceptPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    paper.status = "Accepted";

    paper.timeline.push({
      action: "Paper Accepted by Editor",
      by: req.user.id,
    });

    await paper.save();

    res.json({
      message: "Paper accepted",
      paper,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// REJECT PAPER
exports.rejectPaper = async (req, res) => {
  try {
    const { reason } = req.body;

    const paper = await Paper.findById(req.params.id);

    paper.status = "Rejected";

    paper.timeline.push({
      action: `Paper Rejected: ${reason || "No reason provided"}`,
      by: req.user.id,
    });

    await paper.save();

    res.json({
      message: "Paper rejected",
      paper,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//👉 MOVE TO REVIEW STAGE
exports.moveToReview = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    paper.status = "Under Review";

    paper.timeline.push({
      action: "Moved to Peer Review Stage",
      by: req.user.id,
    });

    await paper.save();

    res.json({
      message: "Paper moved to review stage",
      paper,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= Submit revision =================

exports.submitRevision = async (req, res) => {
  try {
    const { comment } = req.body;

    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // upload new version file
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    // increase revision round
    paper.revisionRound += 1;

    // add new version
    paper.versions.push({
      version: paper.revisionRound,
      fileUrl: result.secure_url,
      comment: comment || "Revision submitted",
    });

    // reset status back to review
    paper.status = "Under Review";

    // timeline update
    paper.timeline.push({
      action: `Revision Round ${paper.revisionRound} submitted`,
      by: req.user.id,
    });

    await paper.save();

    res.json({
      message: "Revision submitted successfully",
      paper,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
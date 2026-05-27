const cloudinary = require("../config/cloudinary");
const Paper = require("../models/Paper");

// ================= UPLOAD PAPER =================
exports.uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }
    console.log("REQ FILE:", req.file);
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });
    console.log("CLOUDINARY URL:", result.secure_url);

    const { title, abstract, authorName, keywords } = req.body;

    const paper = await Paper.create({
      title,
      abstract,
      authorName,
      keywords: keywords ? keywords.split(",") : [],
      submittedBy: req.user.id,
      fileUrl: result.secure_url,
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
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL PAPERS =================
exports.getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find()
  .populate("submittedBy", "name email role")
  .populate("assignedReviewers", "name email")
  .sort({ createdAt: -1 });
    
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MY PAPERS =================
exports.getMyPapers = async (req, res) => {
  try {
    const papers = await Paper.find({
      submittedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PAPER BY ID =================
exports.getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate(
      "submittedBy",
      "name email role"
    );

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
console.log("PAPER FROM DB:", paper);
console.log("FILE URL:", paper.fileUrl);
    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ACCEPT =================
exports.acceptPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    paper.status = "Accepted";

    paper.timeline.push({
      action: "Accepted by Admin",
      by: req.user.id,
    });

    await paper.save();

    res.json({ message: "Paper accepted", paper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REJECT =================
exports.rejectPaper = async (req, res) => {
  try {
    const { reason } = req.body;

    const paper = await Paper.findById(req.params.id);

    paper.status = "Rejected";

    paper.timeline.push({
      action: `Rejected: ${reason || "No reason"}`,
      by: req.user.id,
    });

    await paper.save();

    res.json({ message: "Paper rejected", paper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= MOVE TO REVIEW =================
exports.moveToReview = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    paper.status = "Under Review";

    paper.timeline.push({
      action: "Moved to review stage",
      by: req.user.id,
    });

    await paper.save();

    res.json({ message: "Moved to review", paper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REVISION =================
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

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    paper.revisionRound += 1;

    paper.versions.push({
      version: paper.revisionRound,
      fileUrl: result.secure_url,
      comment: comment || "Revision uploaded",
    });

    paper.status = "Under Review";

    paper.timeline.push({
      action: `Revision ${paper.revisionRound} submitted`,
      by: req.user.id,
    });

    await paper.save();

    res.json({ message: "Revision submitted", paper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
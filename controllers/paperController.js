const cloudinary = require("../config/cloudinary");
const Paper = require("../models/Paper");


// ================= UPLOAD PAPER =================
exports.uploadPaper = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Check file
    if (!req.file) {
      return res.status(400).json({
        error: "No file received"
      });
    }

    // Get form data
    const { title, abstract, consentGiven } = req.body;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw"
    });

    // Save paper in MongoDB
    const paper = await Paper.create({
      title,
      abstract,
      consentGiven,
      author: req.user.id,
      fileUrl: result.secure_url
    });

    res.status(201).json({
      message: "Paper uploaded successfully",
      paper
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
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
    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    res.json({
      message: "Paper accepted",
      paper
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// REJECT PAPER
exports.rejectPaper = async (req, res) => {
  try {
    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json({
      message: "Paper rejected",
      paper
    });

  } catch (error) {

  console.log("UPLOAD ERROR:");
  console.log(error);

  res.status(500).json({
    error: error.message
  });
}
};
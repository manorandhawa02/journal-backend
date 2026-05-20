const Paper = require("../models/Paper");
const Review = require("../models/Review");

// ================= GET REVIEW SUMMARY =================
exports.getReviewSummary = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate("reviews");

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const reviews = await Review.find({ paper: paper._id });

    const summary = {
      totalReviews: reviews.length,
      accept: 0,
      minorRevision: 0,
      majorRevision: 0,
      reject: 0,
    };

    reviews.forEach((r) => {
      if (r.recommendation === "Accept") summary.accept++;
      if (r.recommendation === "Minor Revision") summary.minorRevision++;
      if (r.recommendation === "Major Revision") summary.majorRevision++;
      if (r.recommendation === "Reject") summary.reject++;
    });

    res.json({
      paperId: paper._id,
      status: paper.status,
      summary,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= Auto Decision Suggestion =================
exports.suggestDecision = async (req, res) => {
  try {
    const reviews = await Review.find({ paper: req.params.id });

    let score = {
      accept: 0,
      minor: 0,
      major: 0,
      reject: 0,
    };

    reviews.forEach((r) => {
      if (r.recommendation === "Accept") score.accept++;
      if (r.recommendation === "Minor Revision") score.minor++;
      if (r.recommendation === "Major Revision") score.major++;
      if (r.recommendation === "Reject") score.reject++;
    });

    let suggestion = "Major Revision";

    if (score.accept >= 2) suggestion = "Accept";
    if (score.reject >= 2) suggestion = "Reject";
    if (score.major >= 2) suggestion = "Major Revision";
    if (score.minor >= 2 && score.accept >= 1) suggestion = "Minor Revision";

    res.json({
      message: "Suggested decision generated",
      suggestion,
      score,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= Final Editor decision =================
exports.finalDecision = async (req, res) => {
  try {
    const { decision } = req.body; 
    // Accept | Reject | Minor Revision | Major Revision

    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // 🔥 UPDATE STATUS LOGIC
    if (decision === "Accept") {
      paper.status = "Accepted";
    }

    if (decision === "Reject") {
      paper.status = "Rejected";
    }

    if (decision === "Minor Revision") {
      paper.status = "Minor Revision";
      paper.revisionRound += 1;
    }

    if (decision === "Major Revision") {
      paper.status = "Major Revision";
      paper.revisionRound += 1;
    }

    // 🔥 ADD TIMELINE ENTRY
    paper.timeline.push({
      action: `Editorial Decision: ${decision}`,
      by: req.user.id,
    });

    await paper.save();

    res.json({
      message: "Final decision recorded",
      paper,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
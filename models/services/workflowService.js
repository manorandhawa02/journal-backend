const Paper = require("../models/Paper");

exports.updatePaperStatus = async (paperId) => {
  const paper = await Paper.findById(paperId).populate("reviews");

  if (!paper) return;

  const allSubmitted = paper.reviews.every(
    (r) => r.status === "Submitted"
  );

  if (allSubmitted) {
    paper.status = "Reviews Completed";
  }

  await paper.save();
};
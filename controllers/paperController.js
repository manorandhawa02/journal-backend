const cloudinary = require("../config/cloudinary");
const Paper = require("../models/Paper");

exports.uploadPaper = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  if (!req.file) {
    return res.status(400).json({
      error: "No file received"
    });
  }

  res.json({
    message: "File received successfully",
    fileName: req.file.originalname
  });
};
const multer = require("multer");

const storage = multer.memoryStorage(); // store in buffer

const upload = multer({ storage });

module.exports = upload;
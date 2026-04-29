const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadPaper } = require('../controllers/paperController');
const { protect } = require('../middleware/authMiddleware');

router.post('/upload', protect, upload.single("file"), uploadPaper);

module.exports = router;
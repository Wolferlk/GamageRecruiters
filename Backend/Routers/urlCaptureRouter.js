const express = require('express');
const urlCaptureController = require('../Controllers/urlCaptureController');

const router = express.Router();

// Route to capture frontend url ...
router.post('/url', urlCaptureController.captureFrontendURL);

module.exports = router;
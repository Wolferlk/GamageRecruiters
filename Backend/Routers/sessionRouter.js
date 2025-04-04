const express = require('express');
const authenticateToken = require('../auth/token/authenticateToken');
const sessionController = require('../Controllers/sessionController');

const router = express.Router();

// Route to get the Logged User Data ...
router.get('/profile-data', sessionController.getLoggedUserData);
// router.get('/profile-data', authenticateToken, sessionController.getLoggedUserData);

// Route to get a new access token ...
router.put('/update-access-token', sessionController.generateNewAccessToken);

module.exports = router;
const express = require('express');
const authenticateToken = require('../auth/token/authenticateToken');
const sessionController = require('../Controllers/sessionController');

const router = express.Router();

// Route to get the Logged User Data ...
router.get('/profile-data', sessionController.getLoggedUserData);
// router.get('/profile-data', authenticateToken, sessionController.getLoggedUserData);

// Route to get the logged user data according to token ...
router.get('/profile-data/:token', sessionController.getTokenRelatedLoggedUserData);

// Route to handle access token ...
router.post('/handle-token', sessionController.handleAccessToken);

// Route to verify token validity ...
router.get('/handle-token/:token', sessionController.verifyAccessToken);

// Route to get user login attempts ...
router.get('/login-attempts/:userId', sessionController.getUserLoginAttempts);

module.exports = router;
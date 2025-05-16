const express = require('express');
const upload = require('../middlewares/fileUploading');
const userController = require('../Controllers/userController');

const router = express.Router();

// View All Client Users
router.get('/all', userController.getAllClientUsers);

// Update User CV Route ...
router.put('/update-user-cv', upload, userController.uploadUserCV);

// Upload User Image Route ...
router.put('/upload-user-image', upload, userController.uploadUserImage);

// Update Profile Route ...
router.put('/update-user-data/:userId', upload, userController.updateUserDetails);

// Delete Profile Route ...
router.delete('/delete-profile/:userId', userController.deleteUser);

// Change Password Route ...
router.post('/change-password', userController.changePassword);

// Access Job Application Status ...
router.get('/application-status/:userId', userController.getUserRecentJobActivity);

// Access Last Active Status ...
router.get('/last-active-status/:userId', userController.getLastActiveStatus);

// Access User Profile Recent Activity Data ...
router.get('/recent-activity/:userId', userController.getRecentProfileActivity);

// Subscribe to News Letter ...
router.post('/subscribe-newsletter', userController.subscribeToNewsletter);

// Fetch Users Data ...
router.get('/all-users', userController.getAllSystemUsers);

// Fetch User By Id ...
router.get('/:userId', userController.getUserById);

router.get('/user/:userId/details', userController.getAllUserDetails);

module.exports = router;
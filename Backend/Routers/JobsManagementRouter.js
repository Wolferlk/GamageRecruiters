const express = require("express");
const adminAuth = require('../middlewares/adminAuth');
const {
  viewJobs,
  viewLatestJobs,
  viewJob,
  addJob,
  updateJob,
  deleteJob,
  viewJobsByUser,
  viewAppliedJobCountByUser,
  getAllCVsRelatedToAJob,
  getJobStatistics
} = require("../Controllers/JobsManagementController");
const router = express.Router();


// In your router file
router.get("/statistics", adminAuth, getJobStatistics);


// View all Jobs ...
router.get("/", viewJobs);

// View Latest Jobs ...
router.get("/latest", viewLatestJobs);

// View a Job by id ...
router.get("/:jobId", viewJob);

// View jobs applied by a user ...
router.get("/applied/:userId", viewJobsByUser);

// View applied job count by a user ...
router.get("/applied/count/:userId", viewAppliedJobCountByUser);

// Add a New Job
router.post("/addjob", adminAuth, addJob);

// Update a Job
router.put("/update/:jobId", adminAuth, updateJob);

// Delete a Job
router.delete("/delete/:jobId", adminAuth, deleteJob);

// Fetch job applications resumes for a job
router.get("/resumes/:jobId", adminAuth, getAllCVsRelatedToAJob);

module.exports = router;


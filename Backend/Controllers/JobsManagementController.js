const { pool } = require("../config/dbConnection");

// View All Jobs
async function viewJobs(req, res) {
  try {
    const sql = "SELECT * FROM jobs";
    pool.query(sql, (error, results) => {
      if (error) {
        console.log("Error executing query:", error); // Log the exact error from the query
        return res.status(500).send("Error fetching jobs");
      }
      console.log("Results:", results); // Log the query results
      return res.status(200).json({ jobs: results });
    });
  } catch (error) {
    console.log("Server error:", error); // Log server errors
    return res.status(500).send("Server error");
  }
}

// View a Job by ID ...
async function viewJob (req, res) {
  const { jobId } = req.params;

  console.log(jobId);

  if(!jobId) {
    return res.status(400).send("Job ID is required");
  }

  try {
    // Fetch job data ...
    const jobDataQuery = 'SELECT * FROM jobs WHERE jobId = ?';  
    pool.query(jobDataQuery, [jobId], (error, result) => {
      if(error) {
        console.log("Error fetching job data:", error);
        return res.status(500).send(error);
      }

      if(result.length === 0) {
        return res.status(404).send("Job not found");
      }

      const jobData = result[0];
      return res.status(200).json({ message: 'Data Found for Id', data: jobData });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
} 

// View Jobs applied by a user ...
async function viewJobsByUser(req, res) {
  const { userId } = req.params;

  if(!userId) {
    return res.status(400).send("User ID is required");
  }

  try {
    const fetchAppliedJobsQuery = 'SELECT * FROM jobapplications WHERE userId = ?';
    pool.query(fetchAppliedJobsQuery, [userId], (error, results) => {
      if (error) {
        console.log("Error fetching applied jobs:", error);
        return res.status(500).send(error);
      }

      if (results.length === 0) {
        return res.status(404).send("No jobs found for this user");
      }

      return res.status(200).json({ message: 'Jobs Found for user', data: results });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

// Add a New Job
async function addJob(req, res) {
  const {
    title,
    aboutRole,
    responsibilities,
    requirements,
    benefits,
    companyInfo,
  } = req.body;

  if (
    !title ||
    !aboutRole ||
    !responsibilities ||
    !requirements ||
    !benefits ||
    !companyInfo
  ) {
    return res.status(400).send("All fields are required");
  }

  try {
    const sql =
      "INSERT INTO jobs (title, aboutRole, responsibilities, requirements, benefits, companyInfo, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      title,
      aboutRole,
      responsibilities,
      requirements,
      benefits,
      companyInfo,
      new Date(),
    ];

    pool.query(sql, values, (error, data) => {
      if (error) {
        console.log(error);
        return res.status(400).send("Error adding job");
      }

      return res
        .status(201)
        .json({ message: "Job added successfully", jobId: data.insertId });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

// Update a Job
async function updateJob(req, res) {
  const { jobId } = req.params; // Job ID from URL
  const {
    title,
    aboutRole,
    responsibilities,
    requirements,
    benefits,
    companyInfo,
  } = req.body;

  if (
    !title ||
    !aboutRole ||
    !responsibilities ||
    !requirements ||
    !benefits ||
    !companyInfo
  ) {
    return res.status(400).send("All fields are required");
  }

  try {
    const sql =
      "UPDATE jobs SET title = ?, aboutRole = ?, responsibilities = ?, requirements = ?, benefits = ?, companyInfo = ?, updatedAt = ? WHERE jobId = ?";
    const values = [
      title,
      aboutRole,
      responsibilities,
      requirements,
      benefits,
      companyInfo,
      new Date(),
      jobId,
    ];

    pool.query(sql, values, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(400).send("Error updating job");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Job not found");
      }

      return res.status(200).json({ message: "Job updated successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

// Delete a Job
async function deleteJob(req, res) {
  const { jobId } = req.params; // Job ID from URL

  try {
    const sql = "DELETE FROM jobs WHERE jobId = ?";
    pool.query(sql, [jobId], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(400).send("Error deleting job");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Job not found");
      }

      return res.status(200).json({ message: "Job deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

module.exports = { viewJobs, viewJob, addJob, updateJob, deleteJob, viewJobsByUser };

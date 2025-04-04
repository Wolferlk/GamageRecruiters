const { pool } = require('../config/dbConnection');
const path = require('path');

// Apply for a job (with resume file upload)
async function applyJob(req, res) {
    console.log(req.body);
    const { firstName, lastName, email, phoneNumber, job, company } = req.body;

    if( !firstName || !lastName || !email || !phoneNumber || !job || !company ) {
        return res.status(400).send('Please fill all the required fields');
    }

    const resumeLink = req.file?.path ? req.file.path : null;
    const resumeName = req.file?.filename ? req.file.filename : null;

    console.log(resumeLink);
    console.log(resumeName);

    if(!resumeLink || !resumeName) {
        return res.status(400).send('Resume file selection is required.');
    }

    try {
        // Check whether the job exists ...
        const jobApplicationQuery = 'SELECT * FROM jobs WHERE jobName = ? AND company = ?';
        pool.query(jobApplicationQuery, [job, company], (error, result) => {
            if(error) {
                console.log(error);
                return res.status(404).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('No job applications found for the specified job and company.');
            } 

            console.log(result);
            // Add the application details to database ...
            const jobId = result[0].jobId;
            console.log(jobId);
            // check if the user exists ...
            const userQuery = 'SELECT * FROM users WHERE email = ?';
            pool.query(userQuery, email, (error, result) => {
                if (error) {
                    return res.status(400).send(error);
                }

                if(result.length === 0) {
                    return res.status(404).send('User Not Found. You must login first.');
                } 

                if(result[0].firstName === firstName || result[0].lastName === lastName) {
                    return res.status(400).send('Names are not matching. Cannot proceed');
                }

                // User exists, proceed to insert the application ...
                const userId = result[0].userId;
                const insertDataQuery = 'INSERT INTO jobapplications (firstName, lastName, email, phoneNumber, resume, appliedDate, jobId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                pool.query(insertDataQuery, [firstName, lastName, email, phoneNumber, resumeLink, new Date(), jobId, userId], (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send(error);
                    }

                    console.log(result);
                    return res.status(200).json({ message: 'Job application submitted successfully!', data: result });
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

// async function applyJob(req, res) {
//     const { userId, jobId, coverLetter } = req.body;

//     // Check if required fields are provided
//     if (!userId || !jobId || !coverLetter || !req.file) {
//         return res.status(400).json({ message: 'User ID, Job ID, Cover Letter, and Resume are required.' });
//     }

//     const resumeLink = req.file.path; // The file path of the uploaded resume

//     try {
//         // Check if the user already has an application for the same job
//         const [existingApplication] = await pool.promise().query(
//             'SELECT * FROM jobapplications WHERE userId = ? AND jobId = ?',
//             [userId, jobId]
//         );

//         if (existingApplication.length > 0) {
//             // If an existing application is found, update the resume
//             await pool.promise().query(
//                 'UPDATE jobapplications SET resumeLink = ?, coverLetter = ?, status = ? WHERE userId = ? AND jobId = ?',
//                 [resumeLink, coverLetter, 'Pending', userId, jobId]
//             );
//             return res.status(200).json({ message: 'Job application updated successfully!' });
//         } else {
//             // If no existing application, insert a new job application
//             await pool.promise().query(
//                 'INSERT INTO jobapplications (userId, jobId, resumeLink, coverLetter, status) VALUES (?, ?, ?, ?, ?)',
//                 [userId, jobId, resumeLink, coverLetter, 'Pending']
//             );
//             return res.status(201).json({ message: 'Job application submitted successfully!' });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: 'Error submitting or updating job application.', error: error.message });
//     }
// }

// Get applications (either specific or all)
async function getApplications(req, res) {
    const { id } = req.params; // If id is provided, get specific application
    try {
        if (id) {
            const [results] = await pool.promise().query('SELECT * FROM jobapplications WHERE id = ?', [id]);

            if (results.length === 0) {
                return res.status(404).json({ message: 'Job application not found.' });
            }

            return res.status(200).json({ application: results[0] });
        } else {
            const [results] = await pool.promise().query('SELECT * FROM jobapplications');
            if (results.length === 0) {
                return res.status(404).json({ message: 'No job applications found.' });
            }

            return res.status(200).json({ applications: results });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving job applications.', error: error.message });
    }
}

// Delete a job application
async function deleteApplication(req, res) {
    const { id } = req.params;

    try {
        const [results] = await pool.promise().query('SELECT * FROM jobapplications WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Job application not found.' });
        }

        await pool.promise().query('DELETE FROM jobapplications WHERE id = ?', [id]);
        return res.status(200).json({ message: 'Job application deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting job application.', error: error.message });
    }
}

module.exports = { applyJob, getApplications, deleteApplication };

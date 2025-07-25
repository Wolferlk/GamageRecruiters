const bcrypt = require('bcryptjs');
const { pool } = require('../config/dbConnection');
const { setTimeStatus } = require('../utils/changeDateFormat');
const subscriptionNotifyEmailSending = require('../middlewares/subscriptionNotifyEmailSending');
const deleteUploadedFile =require('../utils/deleteUplodedFile');

async function uploadUserImage(req, res) {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('Image Upload Failed: Missing user ID');
    }

    try {
        const imageName = req.files?.photo?.[0]?.filename || null;

        if (!imageName) {
            return res.status(403).send('No image provided');
        }

        const getUserQuery = 'SELECT photo FROM users WHERE userId = ?';
        pool.query(getUserQuery, [id], async (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal Server Error');
            }

            if (result.length === 0) {
                return res.status(404).send('User not found');
            }

            const oldPhoto = result[0].photo;

            // Delete old image if it exists and is different from the new one
            try {
                if (oldPhoto && oldPhoto !== imageName) {
                    await deleteUploadedFile('photo', oldPhoto);
                }
            } catch (deleteError) {
                console.error('Image Deletion Error:', deleteError.message);
            }

            const updateImageQuery = 'UPDATE users SET photo = ? WHERE userId = ?';
            pool.query(updateImageQuery, [imageName, id], (error, updateResult) => {
                if (error) {
                    console.error('Image Upload DB Error:', error);
                    return res.status(400).send('Image upload error');
                }

                if (updateResult.affectedRows === 0) {
                    return res.status(400).send('Image upload failed');
                }

                const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
                pool.query(setActivityQuery, [id, 'Updated User Image', new Date()], (logError, logResult) => {
                    if (logError) {
                        console.error('Activity Log Error:', logError);
                        return res.status(400).send('Activity log failed');
                    }

                    return res.status(200).json({
                        message: 'Image uploaded successfully',
                        data: logResult,
                        image: imageName
                    });
                });
            });
        });

    } catch (error) {
        console.error('Unexpected Error:', error);
        return res.status(500).send('Unexpected server error');
    }
}

async function uploadUserCV(req, res) {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('CV Upload Failed: Missing user ID');
    }

    try {
        const cvName = req.files?.cv?.[0]?.filename || null;

        if (!cvName) {
            return res.status(403).send('No CV file provided');
        }

        const getUserQuery = 'SELECT cv FROM users WHERE userId = ?';
        pool.query(getUserQuery, [id], async (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal Server Error');
            }

            if (result.length === 0) {
                return res.status(404).send('User not found');
            }

            const oldCv = result[0].cv;

            // Delete the old CV file if it exists
            try {
                if (oldCv && oldCv !== cvName) {
                    await deleteUploadedFile('cv', oldCv);
                }
            } catch (deleteError) {
                console.error('CV Deletion Error:', deleteError.message);
            }

            const updateQuery = 'UPDATE users SET cv = ? WHERE userId = ?';
            pool.query(updateQuery, [cvName, id], (updateError, updateResult) => {
                if (updateError) {
                    console.error('CV Upload DB Error:', updateError);
                    return res.status(400).send('Error updating user CV');
                }

                if (updateResult.affectedRows === 0) {
                    return res.status(400).send('CV upload failed');
                }

                const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
                pool.query(setActivityQuery, [id, 'Updated User CV', new Date()], (logError, logResult) => {
                    if (logError) {
                        console.error('Activity Log Error:', logError);
                        return res.status(400).send('Activity log failed');
                    }

                    return res.status(200).json({
                        message: 'CV uploaded successfully',
                        data: logResult,
                        cv: cvName
                    });
                });
            });
        });

    } catch (error) {
        return res.status(500).send('Unexpected server error');
    }
}

async function updateUserDetails(req, res) {
    const { userId } = req.params;
    const {
        firstName, lastName, gender, birthDate, address, address2,
        phoneNumber1, phoneNumber2, linkedInLink, facebookLink,
        portfolioLink, profileDescription
    } = req.body;

    if (!userId || !firstName || !lastName || !gender || !birthDate || !address || !phoneNumber1 || !profileDescription) {
        return res.status(400).send('Error with required fields');
    }

    const cvName = req.files?.cv?.[0]?.filename || null;
    const imageName = req.files?.photo?.[0]?.filename || null;

    try {
        const getUserQuery = "SELECT * FROM users WHERE userId = ?";
        pool.query(getUserQuery, [userId], async (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal Server Error');
            }

            if (result.length === 0) {
                return res.status(404).send('User not found');
            }

            const existingUser = result[0];
            const oldPhoto = existingUser.photo;
            const oldCv = existingUser.cv;

            // Delete old files if new ones are uploaded
            try {
                if (imageName && oldPhoto && imageName !== oldPhoto) {
                    await deleteUploadedFile('photo', oldPhoto);
                }

                if (cvName && oldCv && cvName !== oldCv) {
                    await deleteUploadedFile('cv', oldCv);
                }
            } catch (deleteErr) {
                console.error('File deletion error:', deleteErr.message);
            }

            let values;
            let updateQuery;

            if (!cvName && !imageName) {
                values = [
                    firstName, lastName, gender, birthDate, address, address2,
                    phoneNumber1, phoneNumber2, linkedInLink, facebookLink,
                    portfolioLink, profileDescription, userId
                ];

                updateQuery = `UPDATE users SET
                    firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?,
                    phoneNumber1 = ?, phoneNumber2 = ?, linkedInLink = ?, facebookLink = ?, portfolioLink = ?,
                    profileDescription = ? WHERE userId = ?`;
            } else if (!cvName && imageName) {
                values = [
                    firstName, lastName, gender, birthDate, address, address2,
                    phoneNumber1, phoneNumber2, imageName, linkedInLink, facebookLink,
                    portfolioLink, profileDescription, userId
                ];

                updateQuery = `UPDATE users SET
                    firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?,
                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, linkedInLink = ?, facebookLink = ?,
                    portfolioLink = ?, profileDescription = ? WHERE userId = ?`;
            } else if (cvName && !imageName) {
                values = [
                    firstName, lastName, gender, birthDate, address, address2,
                    phoneNumber1, phoneNumber2, cvName, linkedInLink, facebookLink,
                    portfolioLink, profileDescription, userId
                ];

                updateQuery = `UPDATE users SET
                    firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?,
                    phoneNumber1 = ?, phoneNumber2 = ?, cv = ?, linkedInLink = ?, facebookLink = ?,
                    portfolioLink = ?, profileDescription = ? WHERE userId = ?`;
            } else {
                values = [
                    firstName, lastName, gender, birthDate, address, address2,
                    phoneNumber1, phoneNumber2, imageName, cvName, linkedInLink,
                    facebookLink, portfolioLink, profileDescription, userId
                ];

                updateQuery = `UPDATE users SET
                    firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?,
                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, cv = ?, linkedInLink = ?, facebookLink = ?,
                    portfolioLink = ?, profileDescription = ? WHERE userId = ?`;
            }

            pool.query(updateQuery, values, (error, result) => {
                if (error) {
                    console.error('Update error:', error);
                    return res.status(400).send('An error occurred during update');
                }

                if (result.affectedRows === 0) {
                    return res.status(400).send('User data update failed');
                }

                const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
                pool.query(setActivityQuery, [userId, 'Updated User Data', new Date()], (error, log) => {
                    if (error) {
                        console.error('Activity log error:', error);
                        return res.status(400).send('Activity log failed');
                    }

                    return res.status(200).json({ message: 'User data updated successfully', data: log });
                });
            });
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).send('Unexpected server error');
    }
}

async function deleteUser (req, res) {
    try {
        const userId = req.params.userId;

        if(!userId) {
            return res.status(400).send('Deletion Failed. Specifiy a userId.');
        }

        // had to delete all the related table records for user.
        // delete acitivityLogs records
        const deleteActivityLogsQuery = 'DELETE FROM activitylogs WHERE userId = ?';
        pool.query(deleteActivityLogsQuery, [userId], (activityError, activityResult) => {
            if(activityError) {
                console.log(activityError);
                return res.status(400).send('Failed to delete activity logs');
            }

            // delete blogcommnet records for user
            const deleteBlogCommentsQuery = 'DELETE FROM blogcomments WHERE userId = ?';
            pool.query(deleteBlogCommentsQuery, [userId], (blogcommentError, blogcommetResult) => {
                if(blogcommentError) {
                    console.log(blogcommentError);
                    return res.status(400).send('Failed to delete blog comments for the user.');
                }
                
                // delete bloglikes records for user
                const deleteBlogLikesQuery = 'DELETE FROM bloglikes WHERE userId = ?';
                pool.query(deleteBlogLikesQuery, [userId], (blogLikesError, blogLikesResult) => {
                    if(blogLikesError) {
                        console.log(blogLikesError);
                        return res.status(400).send('Failed to delete blog likes for the user.');
                    }

                    // delete job applications records for user
                    const deleteJobApplicationsQuery = 'DELETE FROM jobapplications WHERE userId = ?';
                    pool.query(deleteJobApplicationsQuery, [userId], (jobApplicationsError, jobApplicationsResult) => {
                        if(jobApplicationsError) {
                            console.log(jobApplicationsError);
                            return res.status(400).send('Failed to delete job applications for the user.');
                        }

                        // delete user
                        const deleteUserQuery = 'DELETE FROM users WHERE userId = ?';
                        pool.query(deleteUserQuery, [userId], (error, result) => {
                            if(error) {
                                console.log(error);
                                return res.status(400).send('Deletion Failed');
                            } 
                            
                            return res.status(200).json({ message: 'User Deleted Successfully', data: result });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function changePassword (req, res) {
    const { oldPassword, newPassword, userId } = req.body;

    if(!oldPassword || !newPassword) {
        return res.status(400).send('Both Old and New Passwords required to proceed');
    }
    
    try {
        // get the user details related to userId ...
        const userDataQuery = 'SELECT * FROM users WHERE userId = ?';
        pool.query(userDataQuery, [userId], async (error, result) => {
            if(error) {
                console.log(error);
                return res.status(404).send('User Not Found');
            }

            // check oldPassword validity ...
            const isValidOldPassword = await bcrypt.compare(oldPassword, result[0].password);
            if(!isValidOldPassword) {
                return res.status(400).send('Old Password is incorrect !');
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // update password in database ...
            const updatePasswordQuery = 'UPDATE users SET password = ? WHERE userId = ?';

            pool.query(updatePasswordQuery, [hashedNewPassword, userId], (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send(error);
                }

                if(result.affectedRows === 0) {
                    return res.status(400).send('Password Change Failed');
                }

                const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
                pool.query(setActivityQuery, [userId, `Changed User Password From ${oldPassword} to ${newPassword}`, new Date()], (error, log) => {
                    if(error) {
                        console.log(error);
                        return res.status(400).send('Activity Log Failed');
                    }

                    if(log.affectedRows === 0) {
                        return res.status(400).send('Log Insertion Failed');
                    }

                    return res.status(200).json({ message: 'Password Changed Successfully', data: log });
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getUserRecentJobActivity (req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('userId Required');
    }

    try {
        const jobActivityQuery = 'SELECT * FROM jobapplications INNER JOIN jobs INNER JOIN users ON jobapplications.jobId = jobs.jobId AND jobapplications.userId = users.userId WHERE jobapplications.userId = ? ORDER BY appliedDate DESC LIMIT 1';
        pool.query(jobActivityQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length === 0) {
                return res.status(404).send('No Job Activity Found');
            }

            const gap = result[0].appliedDate ? setTimeStatus(result[0].appliedDate) : null;
            // console.log(gap);
            return res.status(200).json({ message: 'Job Activity Found', jobStatus: gap, data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 

async function getLastActiveStatus(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send('userId Required');
    }

    try {
        const query = 'SELECT lastActive FROM users WHERE userId = ?';
        pool.query(query, [userId], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('No active status found for this user');
            }

            const lastActiveStatus = result[0].lastActive ? setTimeStatus(result[0].lastActive) : null;
            return res.status(200).json({ message: 'Last Active Status Found', lastActive: lastActiveStatus });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getRecentProfileActivity(req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('userId Required');
    }

    try {
        const recentActivityQuery = 'SELECT * FROM activitylogs INNER JOIN users ON activitylogs.userId = users.userId WHERE activitylogs.userId = ? ORDER BY activitylogs.completedAt DESC LIMIT 1';
        pool.query(recentActivityQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                 // Return 200 with empty data instead of 404
                return res.status(200).json({ 
                    message: 'No recent activity found',
                    recentActivity: '',
                    timeStatus: '' 
                });
            } 

            const recentActivity = result[0].activity;
            const completedAt = result[0].completedAt ? setTimeStatus(result[0].completedAt) : null;

            return res.status(200).json({ message: 'Recent Activity Found', recentActivity: recentActivity, timeStatus: completedAt });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function subscribeToNewsletter(req, res) {
    const { email } = req.body;

    if(!email) {
        return res.status(400).send('Email Required for Subscription');
    }

    try {
        // check the email validity ...
        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(checkEmailQuery, email, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

             // If no user found with this email
            if(result.length === 0) {
                return res.status(404).send('Email not registered. Please sign up first.');
            }

            // Check if user is already subscribed
            if(result[0].subscribedToNewsLetter === 1) {
                return res.status(200).send('You are already subscribed to our newsletter');
            }

            // Update subscription status
            const updateSubscriptionStatusQuery = 'UPDATE users SET subscribedToNewsLetter = ? WHERE email = ?';
            pool.query(updateSubscriptionStatusQuery, [1, email], (error, state) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('Failed to update subscription status');
                }
    
                if(state.affectedRows === 0) {
                    return res.status(400).send('Subscription failed');
                }

                subscriptionNotifyEmailSending(email);
                return res.status(200).send('Subscription Successful');
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllSystemUsers (req, res) {
    try {
        const usersQuery = 'SELECT * FROM users';
        pool.query(usersQuery, (error, result) => {
           if(error) {
               console.log(error);
               return res.status(400).send(error);
           }

           if(result.length === 0) {
               return res.status(404).send('No Users Found');
           }

           return res.status(200).json({ message: 'Users Found', users: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getUserById (req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const userQuery = 'SELECT * FROM users WHERE userId = ?';
        pool.query(userQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length === 0) {
                return res.status(404).send('User Not Found');
            }

            return res.status(200).json({ message: 'User Found', user: result[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllSystemUsersCount (req, res) {
    try {
        const usersCountQuery = 'SELECT COUNT(userId) FROM users';
        pool.query(usersCountQuery, (error, result) => {
           if(error) {
               console.log(error);
               return res.status(400).send(error);
           }

           if(result.length === 0) {
               return res.status(404).send('No Users Found');
           }

           return res.status(200).json({ message: 'Users Found', users: result[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllActiveUsersCount (req, res) {
    try {
        const ActiveUsersCountQuery = 'SELECT COUNT(DISTINCT  sessions.Id) FROM sessions INNER JOIN users ON sessions.Id = users.userId WHERE sessions.status = ?';
        pool.query(ActiveUsersCountQuery, 'Active', (error, data) => {
           if(error) {
               console.log(error);
               return res.status(400).send(error);
           }

           if(data.length === 0) {
               return res.status(404).send('No Active Users Found');
           }

           return res.status(200).json({ message: 'Active Users Found', activeUsers: data[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllUsersCountInCurrentMonth (req, res) {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const activeTimeWindow = new Date(Date.now() - (30 * 60 * 1000)); // Consider users active if they were active in the last 30 minutes
        
        // Query active users created in current month using lastActive column
        const activeUsersQuery = `
            SELECT COUNT(DISTINCT userId) as activeCount 
            FROM users 
            WHERE MONTH(createdAt) = ? 
            AND lastActive > ?
        `;
        
        pool.query(activeUsersQuery, [currentMonth, activeTimeWindow], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(400).send(error);
            }

            return res.status(200).json({
                message: 'Monthly Active Users Found',
                activeUsersCount: result[0].activeCount 
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllClientUsers(req, res) {
    try {
        const query = 'SELECT * FROM users ';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching client users:', error);
                return res.status(500).send('Failed to fetch client users');
            }

            if (results.length === 0) {
                return res.status(404).send('No client users found');
            }

            return res.status(200).json({ message: 'Client users fetched successfully', data: results });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}


async function getAllUserDetails(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const query = 'SELECT * FROM users WHERE userId = ?';
        pool.query(query, [userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Database query failed');
            }

            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            return res.status(200).json({ message: 'User details retrieved successfully', user: results[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service provider
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const otpStore = {}; // In-memory store for OTPs (use DB or Redis for production)

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  // Optional: check if email exists in your database first
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';

  pool.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database query failed');
    }

    if (results.length === 0) {
      return res.status(404).send('Email not registered');
    }

    // Generate OTP and store it with expiry (e.g. 5 min)
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    otpStore[email] = { otp, expiresAt };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).send('Failed to send OTP');
      } else {
        console.log(`OTP sent to ${email}: ${otp}`);
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  });
}





module.exports = { deleteUser,getAllClientUsers, getAllUserDetails, changePassword, updateUserDetails, uploadUserImage, uploadUserCV, getUserRecentJobActivity, getLastActiveStatus, getRecentProfileActivity, subscribeToNewsletter, getAllSystemUsersCount, getAllActiveUsersCount, getAllUsersCountInCurrentMonth, getAllSystemUsers, getUserById ,sendOTP}
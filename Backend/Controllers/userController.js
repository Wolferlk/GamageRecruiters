const bcrypt = require('bcryptjs');
const { pool } = require('../config/dbConnection');

async function uploadUserImage (req, res) {
    console.log(req.body);
    const { id } = req.body;
    console.log(id);
    if(!id) {
        return res.status(400).send('Image Upload Failed');
    }

    try {
        const imageName = req.files?.photo?.[0]?.filename || null;
        console.log(imageName);

        if(imageName) {
            const updateImageQuery = 'UPDATE users SET photo = ? WHERE userId = ?';
            pool.query(updateImageQuery, [imageName, id], (error, result) => {
                if(error) {
                    return res.status(400).send('Image Upload Failed');
                } 

                return res.status(200).json({ message: 'Image Uploaded Successfully', data: result, image: imageName });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function uploadUserCV (req, res) {
    console.log(req.body);
    const { id } = req.body;
    console.log(id);
    if(!id) {
        return res.status(400).send('Image Upload Failed');
    }

    try {
        const cvName = req.files?.cv?.[0]?.filename || null;
        console.log(cvName);

        if(cvName) {
            const updateImageQuery = 'UPDATE users SET cv = ? WHERE userId = ?';
            pool.query(updateImageQuery, [cvName, id], (error, result) => {
                if(error) {
                    return res.status(400).send('Image Upload Failed');
                } 

                return res.status(200).json({ message: 'Image Uploaded Successfully', data: result, cv: cvName });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function updateUserDetails (req, res) {
    const { userId, firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, cv, linkedInLink, facebookLink, portfolioLink, profileDescription } = req.body; 

    if(!userId || !firstName || !lastName || !gender || !birthDate || !address || !phoneNumber1 || !cv || !profileDescription) {
        return res.status(400).send('Error With required fields');
    } 

    try {
        // If existing, access the file names of the cv and image ...
        const cvName = req.files?.cv?.[0]?.filename || null;
        const imageName = req.files?.photo?.[0]?.filename || null;

        console.log('cvName:', cvName);
        console.log('imageName:', imageName); 

        if(cvName == null && imageName == null) {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

            const updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ? 
                                    WHERE userId = ?`;
            pool.query(updateQuery, values, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('An error occured during update');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
            });
        } else if (cvName == null && imageName != null) {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

            const updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ? 
                                    WHERE userId = ?`;
            pool.query(updateQuery, values, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('An error occured during update');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
            });
        } else if (cvName != null && imageName == null) {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, cv, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

        const updateQuery = `UPDATE users 
                                SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                phoneNumber1 = ?, phoneNumber2 = ?, cv = ?, linkedInLink = ?, facebookLink = ?, 
                                portfolioLink = ?, profileDescription = ? 
                                WHERE userId = ?`;
        pool.query(updateQuery, values, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send('An error occured during update');
            }

            return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
        });
        } else {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, cv, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

            const updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, cv = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ? 
                                    WHERE userId = ?`;
            pool.query(updateQuery, values, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('An error occured during update');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function deleteUser (req, res) {
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(400).send('Deletion Failed');
        }

        const sql = 'DELETE FROM users WHERE userId = ?';
        pool.query(sql, [id], (error, result) => {
            if(error) {
                return res.status(400).send('Deletion Failed');
            } 

            return res.status(200).json({ message: 'User Deleted Successfully', data: result });
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
                    return res.status(400).send('Password Change Failed');
                }

                return res.status(200).json({ message: 'Password Changed Successfully', data: result });
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = { deleteUser, changePassword, updateUserDetails, uploadUserImage, uploadUserCV }
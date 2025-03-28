const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const { otpCache, generateOTP, sendOTP } = require('../middlewares/OTP');
const { localStorage, encryptData } = require('../utils/localStorage');

dotenv.config();

async function register (req, res) {
    const { firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, profileDescription } = req.body;
    
    if(!firstName || !lastName || !gender || !birthDate || !email || !password) {
        return res.status(400).send('Please fill all the required fields');
    }

    try {
        // If existing, access the file names of the cv and image ...
        const cvName = req.files?.cv?.[0]?.filename || null;
        const imageName = req.files?.photo?.[0]?.filename || null;
    
        console.log('cvName:', cvName);
        console.log('imageName:', imageName);
    
        // Encrypt the password ...
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const values = [ firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, hashedPassword, cvName, imageName, profileDescription, new Date() ];
    
        // Register the user by saving details in the database ...
        const sql = 'INSERT INTO users (firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, cv, photo, profileDescription, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; 
        pool.query(sql, values, (error, data) => {
            if(error) {
                return res.status(400).send('Error registering user');
            } 
    
            return res.status(201).json({ message: 'User registered nearly complete. Waiting for Email Verification', data: data});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 

async function login (req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).send('Email and Password cannot be empty');
    }
    
    try {
        // Check if the user exists ...
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(userQuery, [email], async (error, result) => {
            if(error) {
                return res.status(404).send('User Not Found');
            } 

            // Verify the password ...
            const verifyPasswordResult = await bcrypt.compare(password, result[0].password);

            if(!verifyPasswordResult) {
                return res.status(401).send('Invalid Password');
            } 

            // Generate Token ...
            const token = jwt.sign({
                id: result[0].userId,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Pass a Cookie to frontend ...
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'Lax',
                secure: false,
                maxAge: 100 * 60 * 60, // 1 hour ...
            });

            // Store User Data in the database Session ...
            const sessionQuery = 'INSERT INTO sessions (Id, token, createdAt, status, role) VALUES (?, ?, ?, ?, ?)';
            const values = [ result[0].userId, token, new Date(), 'Active', 'User' ];
            pool.query(sessionQuery, values, (error, data) => {
                if(error) {
                    // console.log(error);
                    return res.status(400).send('Error creating session');
                } 

                const key = "Saved User Data";
                const userData = [result[0].userId, 'Email & Password'];
                            
                // Encrypt the array (convert it to a JSON string first) ...
                const { encryptedData, iv } = encryptData(JSON.stringify(userData));
                            
                // Store encrypted data and IV in localStorage ...
                localStorage.setItem(key, JSON.stringify({ encryptedData, iv }));

                return res.status(200).json({ message: 'Login Successful', token: token, data: data });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function sendEmailVerificationOTP (req, res) {
    const { email } = req.body;

    if(!email) {
        return res.status(400).send('Email is required');
    }

    try {
        const otp = generateOTP();
        otpCache[email] = otp;

        // Send the email ...
        sendOTP(email, otp);
        res.cookie('otpCache', otpCache, { maxAge: 3000, httpOnly: true });
        res.status(200).json({message: "OTP sent successfully", otp: otp});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function verifyEmailVerificationOTP (req, res) {
    const { otp, oldEmail, email } = req.body;

    if(!otp || !oldEmail || !email) {
        return res.status(400).send('Something went wrong with required data');
    }
 
    try {
        // Check if email exists in the cache ...
        if(!otpCache.hasOwnProperty(email)) {
            return res.status(404).send("Email not found");
        }

        // Check if the OTP matches the one stored in the cache ...
        if(otpCache[email] === otp) {
            // res.status(200).send("OTP Verified Successfully");
            console.log("OTP Verified Successfully");
            delete otpCache[email]; // Remove the OTP from the cache after successful verification.
            const sql = 'UPDATE users SET email = ? WHERE email = ?';
            pool.query(sql, [email, oldEmail], (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('User Registration Failed');
                } 

                return res.status(200).json({ message: 'User Registration Successfull', data: result });
            });
        } else {
            return res.status(401).send("Invalid OTP");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function emailCheck (req, res) {
    const { email } = req.body;

    if(!email) {
        return res.status(400).send('Something went wrong with email');
    }

    try {
        // Check a user data related to email ....
        const sql = 'SELECT * FROM users WHERE email = ?';
        pool.query(sql, [email], (error, result) => {
            if(error) {
                // console.log(error);
                return res.status(404).send('User Not Found');
            } 

            return res.status(200).json({ message: 'Data Found', data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function resetPassword (req, res) {
    const { email, newPassword } = req.body;

    if(!email || !newPassword) {
        return res.status(400).send('Something went wrong.');
    }

    try {
        const { email, newPassword } = req.body;

        if(!email || !newPassword) {
            return res.status(400).send('Email and Password cannot be empty');
        }

        const sql = 'SELECT * FROM users WHERE email = ?';
        pool.query(sql, [email], async (error, result) => {
            if(error) {
                return res.status(404).send('User Not Found');
            } 

            // Hash the Password ...
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update password in the database ...
            const updateSql = 'UPDATE users SET password = ? WHERE email = ?';
            pool.query(updateSql, [hashedNewPassword, email], (error, data) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('Error updating password');
                }

                return res.status(200).json({ message: 'Password reset successfully', data: data });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = { register, login, sendEmailVerificationOTP, verifyEmailVerificationOTP, emailCheck, resetPassword }


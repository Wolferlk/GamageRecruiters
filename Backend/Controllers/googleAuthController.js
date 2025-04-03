const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const { localStorage, encryptData } = require('../utils/localStorage');

dotenv.config();

async function loginWithGoogle (req, res) {
    try {
        const url = process.env.GOOGLE_AUTH_URL;
        console.log(url);
        return res.status(200).json({ message: 'redirect url', data: url });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function loginGoogleCallback (req, res) {
    try {
        // Store user in session ...
        req.session.user = req.user; 
            
        console.log("User stored in session:", req.session.user);

        const sql = 'INSERT INTO LoginsThroughPlatforms (accountId, photo, name, email, loggedAt, platform) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [req.session.user.id, req.session.user.photo, req.session.user.name, req.session.user.email, new Date(), 'Google'];
        pool.query(sql, values, (error, data) => {
            if(error) {
                return res.status(400).send('Error Saving Data');
            } 

            console.log('Data Saved Successfully', data);

            const key = "Saved User Data";
            const userData = [req.session.user.id, 'Google'];
                                    
            // Encrypt the array (convert it to a JSON string first) ...
            const { encryptedData, iv } = encryptData(JSON.stringify(userData));
                                    
            // Store encrypted data and IV in localStorage ...
            localStorage.setItem(key, JSON.stringify({ encryptedData, iv }));
            
            // Redirect to frontend after setting session and save data ...
            res.redirect(process.env.SUCCESS_REDIRECT_URL);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 

module.exports = { loginGoogleCallback, loginWithGoogle }
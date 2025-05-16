const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const { setLoggedUserIdAndMethod } = require('../utils/setLocalStorageData');
const { addNewUserIfSessionUserNotFound, generateNewTokenForPlatformLogins } = require('../middlewares/userMiddleware');
const splitStrings = require('../utils/splitStrings');
const { fetchFrontendApplicationRunningURL } = require('../utils/retrieveLocalStorageData');

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
        // console.log("User stored in session:", req.session.user);

        // Fetch the URL from localStorage ...
        const url = fetchFrontendApplicationRunningURL();   
        const sql = 'INSERT INTO LoginsThroughPlatforms (accountId, photo, name, email, loggedAt, platform) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [req.session.user.id, req.session.user.photo, req.session.user.name, req.session.user.email, new Date(), 'Google'];
        pool.query(sql, values, (error, data) => {
            if(error) {
                return res.status(400).send('Error Saving Data');
            }  

            setLoggedUserIdAndMethod(req.session.user.id, 'Google');

            const userQuery = 'SELECT * FROM Users WHERE email = ?';
            pool.query(userQuery, [req.session.user.email], async (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send(error);
                } 

                if(result.length === 0) {
                    console.log('User not found, creating new user ...');
                    const userName = splitStrings(req.session.user.name);
                    try {
                        const userData = await addNewUserIfSessionUserNotFound(userName[0], userName[1], req.session.user.email);

                        if(!userData) {
                            return res.status(400).send('Error Occured While Creating a new user');
                        } 

                        // console.log('User Data:', userData);
                        const token = await generateNewTokenForPlatformLogins(userData.userId);

                        if(!token) {
                            return res.status(404).send('Error Occured. Cannot proceed.');
                        }

                        return res.redirect(`${url}/dashboard`);
                    } catch (error) {
                        console.error(error);
                        return res.status(500).send(error);
                    }
                }

                const userData = result[0];
                // console.log('User data:', userData);

                const token = await generateNewTokenForPlatformLogins(userData.userId);

                if(!token) {
                    return res.status(404).send('Error Occured. Cannot proceed.');
                }

                // Redirect to frontend after setting session and save data ...
                return res.redirect(`${url}/dashboard`);
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 

module.exports = { loginGoogleCallback, loginWithGoogle }
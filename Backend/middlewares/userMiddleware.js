const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const { setLoggedPlatformUserRegisteredId } = require('../utils/setLocalStorageData');

dotenv.config();

async function addNewUserIfSessionUserNotFound(firstName, lastName, email) {
    return new Promise((resolve, reject) => {
        // Create a new user ...
        const insertDataQuery = 'INSERT INTO users (firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, cv, photo, profileDescription, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [firstName, lastName, null, null, null, null, null, null, null, null, null, email, null, null, null, null, new Date()];
        pool.query(insertDataQuery, values, (error, result) => {
            if (error) {
                console.log(error);
                return reject('Error creating new user');
            }

            // console.log('New user created:', result);
            // console.log(result.insertId);  // Return the new user ID ... 

            const userQuery = 'SELECT * FROM users WHERE userId = ?';
                pool.query(userQuery, result.insertId, (error, result) => {
                    if(error) {
                        // console.log(error);
                        return reject('Error fetching user data');
                    } 

                    if(result.length == 0) {
                        return reject('User Not Found');
                    }

                    // console.log('User Data:', result);
                    return resolve(result[0]);  // Return the fetched user data...
            });
        });
    });
} 

async function generateNewTokenForPlatformLogins (id) {
    // console.log(id);

    if(!id) {
        return 'Error Occured. Cannot proceed.';
    }

    return new Promise((resolve, reject) => {
        // Set expiration time manually ...
        const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour ...

        // generate a new token for the newly created user ...
        const token = jwt.sign({
            id: id,
            exp: expTime
        }, process.env.JWT_SECRET); 

        // console.log(token);

        // Store the logged User Details in the session ...
        const sessionQuery = 'INSERT INTO sessions (Id, token, createdAt, status, role) VALUES (?, ?, ?, ?, ?)';
        const values = [id, token, new Date(), 'Active', 'User'];
        // console.log(values);
        pool.query(sessionQuery, values, (error, newSession) => {
            if(error) {
                // console.log(error);
                reject('Error creating session');
            }

            setLoggedPlatformUserRegisteredId(id); 

            resolve(token);
        });
    });
}

module.exports = { addNewUserIfSessionUserNotFound, generateNewTokenForPlatformLogins };
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { pool } = require("../../config/dbConnection");
const { localStorage, decryptData } = require('../../utils/localStorage');
const setTimeStampToDate = require("../../utils/changeDateFormat");

dotenv.config();

async function generateNewAccessToken (id, token) {
    if(!id || !token) {
        return 'Error Occured. Cannot proceed.';
    }

    try {
        // Set expiration time manually for the new token ...
        const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour ...

        // generate a new token ...
        const newToken = jwt.sign({
            id: id,
            exp: expTime
        }, process.env.JWT_SECRET);

        // update the token in session ...
        const updateTokenQuery = 'UPDATE sessions SET token = ? WHERE Id = ? AND token = ?';
        return new Promise((resolve, reject) => {
            // get the logged user data from session ...
            pool.query(updateTokenQuery, [newToken, id, token], (error, result) => {
                if(error) {
                    console.log(error);
                    return reject(error);
                } 
        
                if (result.affectedRows === 0) {
                    return reject('Token Update Failed');
                }

                return resolve(newToken);
            });
        });
    } catch (error) {
        return error;
    }
} 

module.exports = generateNewAccessToken;

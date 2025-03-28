const { pool } = require('../config/dbConnection');
const { localStorage, decryptData } = require('../utils/localStorage');

async function getLoggedUserData (req, res) {
    try {
        // get the logged user data from session ...
        const sessionSQL = 'SELECT * FROM sessions ORDER BY createdAt DESC LIMIT 1';
        const userSQL = 'SELECT * FROM users WHERE userId = ?';
        pool.query(sessionSQL, (error, result) => {
            if(error) {
                return res.status(404).send('Session Not Found');
            } 

            const userId = result[0].Id;

            pool.query(userSQL, [userId], (error, data) => {
                if(error) {
                    return res.status(404).send('User Not Found');
                }
                
                return res.status(200).json({ message: 'User Data Retrieved', data: data });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 


// async function getLoggedUserData (req, res) {

//     const key = 'Saved User Data';

//     // Retrieve encrypted data from localStorage ...
//     const storedData = localStorage.getItem(key);

//     if(!storedData) {
//         console.log(`No data found for key: ${key}`);
//         return res.status(404).send('No data found. Error Occured.');
//     } 

//     const { encryptedData, iv } = JSON.parse(storedData); // Parse stored JSON ...
//     const decryptedData = decryptData(encryptedData, iv); // Decrypt data ...
//     const retrievedArray = JSON.parse(decryptedData); // Convert string back to array ...
//     console.log("Decrypted Array:", retrievedArray);
//     const id = retrievedArray[0];
//     const loginMethod = retrievedArray[1];

//     console.log(loginMethod); 

//     if(loginMethod == 'Email & Password') {
//         try {
//             const userData = await getLoggedUserDataThroughEmailPassword(id);
//             console.log('User Data Retrieved:', userData);

//             return res.status(200).json({ message: 'User Data Retrieved', data: userData });
//         } catch (error) {
//             console.error(error);
//             return res.status(404).send(error);
//         }
//     }

//     if(loginMethod == 'Google') {
//         try {
//             const userData = await getLoggedUserDataThroughGoogle(id);
//             console.log('User Data Retrieved:', userData);

//             return res.status(200).json({ message: 'User Data Retrieved', data: userData });
//         } catch (error) {
//             console.error(error);
//             return res.status(404).send(error);
//         }
//     }

//     if(loginMethod == 'Facebook') {
//         try {
//             const userData = await getLoggedUserDataThroughFacebook(id);
//             console.log('User Data Retrieved:', userData);

//             return res.status(200).json({ message: 'User Data Retrieved', data: userData });
//         } catch (error) {
//             console.error(error);
//             return res.status(404).send(error);
//         }
//     }  

//     if(loginMethod == 'LinkedIn') {
//         try {
//             const userData = await getLoggedUserDataThroughLinkedIn(id);
//             console.log('User Data Retrieved:', userData);

//             return res.status(200).json({ message: 'User Data Retrieved', data: userData });
//         } catch (error) {
//             console.error(error);
//             return res.status(404).send(error);
//         }
//     } 

//     return res.status(400).send('An Error Occured. Please Login Again!');
// } 

// // Functions to retrieve the logged user details according to login ...

// async function getLoggedUserDataThroughEmailPassword(id) {
//     console.log('Logged Through Email & Password');

//     if(!id) {
//         return 'Id error';
//     }

//     return new Promise((resolve, reject) => {
//         // get the logged user data from session ...
//         const sessionSQL = 'SELECT * FROM sessions WHERE Id = ? ORDER BY createdAt DESC LIMIT 1';
//         const userSQL = 'SELECT * FROM users WHERE userId = ?';
//         pool.query(sessionSQL, [id], (error, session) => {
//             if(error) {
//                 console.log(error);
//                 return reject('Session Not Found');
//             } 

//             if (session.length === 0) {
//                 return reject('Session Not Found');
//             }

//             console.log(session);
//             const userId = session[0].Id;
//             console.log(userId);

//             pool.query(userSQL, [userId], (error, user) => {
//                 if(error) {
//                     console.log(error);
//                     return reject('User Not Found');
//                 }
                
//                 if (user.length === 0) {
//                     return reject('User Not Found');
//                 }

//                 console.log('User Data:', user);
//                 resolve(user);  // Return the fetched user data ...
//             });

//         });
//     });
// }

// async function getLoggedUserDataThroughGoogle(id) {
//     console.log('Logged Through Google');

//     if(!id) {
//         return 'Id error';
//     }

//     return new Promise((resolve, reject) => {
//         // get the logged user data from the database ...
//         const sessionSQL = 'SELECT * FROM LoginsThroughPlatforms WHERE accountId = ? AND platform = ? ORDER BY loggedAt DESC LIMIT 1';
//         pool.query(sessionSQL, [id, 'Google'], (error, session) => {
//             if(error) {
//                 return reject('Session Not Found');
//             } 

//             if (session.length === 0) {
//                 return reject('Session Not Found');
//             }

//             console.log(session);
//             const loggedUserEmail = session[0].email;
            
//             // Check whether there is existing user related to loggedUserEmail ...
//             const userSQL = 'SELECT * FROM users WHERE email = ?';
//             pool.query(userSQL, loggedUserEmail, (error, user) => {
//                 if(error) {
//                     console.log(error);
//                     return reject('User Not Found');
//                 }
                
//                 if (user.length === 0) {
//                     console.log('Length = 0');
//                     return reject('User Not Found');
//                 }

//                 console.log('User Data:', user);
//                 resolve(user);  // Return the fetched user data ...
//             });
//         });
//     });
// }

// async function getLoggedUserDataThroughFacebook(id) {
//     console.log('Logged Through Facebook');
    
//     if(!id) {
//         return 'Id error';
//     }

//     return new Promise((resolve, reject) => {
//         // get the logged user data from the database ...
//         const sessionSQL = 'SELECT * FROM LoginsThroughPlatforms WHERE accountId = ? AND platform = ? ORDER BY loggedAt DESC LIMIT 1';
//         pool.query(sessionSQL, [id, 'Facebook'], (error, session) => {
//             if(error) {
//                 return reject('Session Not Found');
//             } 

//             if (session.length === 0) {
//                 return reject('Session Not Found');
//             }

//             console.log(session);
//             const loggedUserEmail = session[0].email;
            
//             // Check whether there is existing user related to loggedUserEmail ...
//             const userSQL = 'SELECT * FROM users WHERE email = ?';
//             pool.query(userSQL, loggedUserEmail, (error, user) => {
//                 if(error) {
//                     console.log(error);
//                     return reject('User Not Found');
//                 }
                
//                 if (user.length === 0) {
//                     return reject('User Not Found');
//                 }

//                 console.log('User Data:', user);
//                 resolve(user);  // Return the fetched user data ...
//             });
//         });
//     });
// }

// async function getLoggedUserDataThroughLinkedIn(id) {
//     console.log('Logged Through LinkedIn');
    
//     if(!id) {
//         return 'Id error';
//     }

//     return new Promise((resolve, reject) => {
//         // get the logged user data from the database ...
//         const sessionSQL = 'SELECT * FROM LoginsThroughPlatforms WHERE accountId = ? AND platform = ? ORDER BY loggedAt DESC LIMIT 1';
//         pool.query(sessionSQL, [id, 'LinkedIn'], (error, session) => {
//             if(error) {
//                 return reject('Session Not Found');
//             } 

//             if (session.length === 0) {
//                 return reject('Session Not Found');
//             }

//             console.log(session);
//             const loggedUserEmail = session[0].email;
            
//             // Check whether there is existing user related to loggedUserEmail ...
//             const userSQL = 'SELECT * FROM users WHERE email = ?';
//             pool.query(userSQL, loggedUserEmail, (error, user) => {
//                 if(error) {
//                     console.log(error);
//                     return reject('User Not Found');
//                 }
                
//                 if (user.length === 0) {
//                     return reject('User Not Found');
//                 }

//                 console.log('User Data:', user);
//                 resolve(user);  // Return the fetched user data ...
//             });
//         });
//     });
// }

// async function addNewUserIfSessionUserNotFound(firstName, lastName, email) {
//     return new Promise((resolve, reject) => {
//         const insertDataQuery = 'INSERT INTO users (firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, cv, photo, profileDescription, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//         const values = [firstName, lastName, null, null, null, null, null, null, null, null, null, email, null, null, null, null, new Date()];
//         pool.query()
//     });
// }

module.exports = { getLoggedUserData };
const { localStorage, decryptData } = require('../utils/localStorage');

function fetchLoggedUserIdAndMethod () {
    const key = 'Saved User Data';

    // Retrieve encrypted data from localStorage ...
    const storedData = localStorage.getItem(key);

    if(!storedData) {
        console.log(`No data found for key: ${key}`);
        return 'No data found. Error Occured.';
    } 

    const { encryptedData, iv } = JSON.parse(storedData); // Parse stored JSON ...
    const decryptedData = decryptData(encryptedData, iv); // Decrypt data ...
    const retrievedArray = JSON.parse(decryptedData); // Convert string back to array ...
    // console.log("Decrypted Array:", retrievedArray);
    
    return retrievedArray;
}

function fetchLoggedPlatformUserRegisteredId () {
    const key = 'Saved User Id';
    // Retrieve encrypted data from localStorage ...
    const storeduserId = localStorage.getItem(key);

    if(!storeduserId) {
        // console.log(`No data found for key: ${key}`);
        return 'No data found. Error Occured.';
    } 

    const { encryptedData, iv } = JSON.parse(storeduserId); // Parse stored JSON ...
    const decryptedData = decryptData(encryptedData, iv); // Decrypt data ...
    const retrieveduserId = JSON.parse(decryptedData); // Convert string back to array ...
    return retrieveduserId;
} 

module.exports = { fetchLoggedUserIdAndMethod, fetchLoggedPlatformUserRegisteredId }
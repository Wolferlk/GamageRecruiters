const { localStorage, encryptData, decryptData } = require('../utils/localStorage');

function setFrontendApplicationRunningURL (url) {
    const key = "Saved Frontend Application URL";
                
    // Encrypt the URL (convert it to a JSON string first) ...
    const { encryptedData, iv } = encryptData(JSON.stringify(url));
                
    // Store encrypted data and IV in localStorage ...
    localStorage.setItem(key, JSON.stringify({ encryptedData, iv }));
    
    return 'success';
}

function setLoggedUserIdAndMethod (id, method) {
    const key = "Saved User Data";
    const userData = [id, method];
                
    // Encrypt the array (convert it to a JSON string first) ...
    const { encryptedData, iv } = encryptData(JSON.stringify(userData));
                
    // Store encrypted data and IV in localStorage ...
    localStorage.setItem(key, JSON.stringify({ encryptedData, iv }));
    
    return 'success';
}

function setLoggedPlatformUserRegisteredId (id) {
    const idKey = "Saved User Id";
                        
    // Encrypt the id (convert it to a JSON string first) ...
    const { encryptedData, iv } = encryptData(JSON.stringify(id));
                
    // Store encrypted data and IV in localStorage ...
    localStorage.setItem(idKey, JSON.stringify({ encryptedData, iv }));

    return 'success';
} 

module.exports = { setFrontendApplicationRunningURL, setLoggedUserIdAndMethod, setLoggedPlatformUserRegisteredId }
const { LocalStorage } = require("node-localstorage");
const dotenv = require('dotenv');
const crypto = require('crypto');
const fs = require('fs');

dotenv.config();

// Create a localStorage instance (data will be stored in the 'storage' directory) ...
const storagePath = "./storage";
if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
}

// Ensure restricted access to the directory (security) ...
fs.chmodSync(storagePath, '700');

// Initialize node-localstorage ...
const localStorage = new LocalStorage(storagePath);

// Secret key for encryption/decryption ...
const secretKey = crypto.createHash('sha256').update(process.env.LOCALSTORAGE_SECRET_KEY).digest(); // Ensures 32 bytes ...

// Encrypt data with random IV and store with expiry ...
const encryptData = (data) => {
    const iv = crypto.randomBytes(16);  // Generate a random IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    // Store the IV along with the encrypted data
    return { encryptedData, iv: iv.toString('hex') };
}

const decryptData = (encryptedData, ivHex) => {
    const iv = Buffer.from(ivHex, 'hex');  // Convert stored IV from hex
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}

module.exports = { localStorage, encryptData, decryptData };

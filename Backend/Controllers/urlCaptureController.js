const { setFrontendApplicationRunningURL } = require("../utils/setLocalStorageData");

async function captureFrontendURL(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        setFrontendApplicationRunningURL(url); // Set the URL in localStorage ...
        return res.status(200).json({ message: 'URL captured successfully', url });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 

module.exports = { captureFrontendURL };
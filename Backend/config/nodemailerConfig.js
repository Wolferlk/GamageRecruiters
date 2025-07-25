const nodemailer = require("nodemailer");
const setConfirmEmailBody = require('../utils/confirmEmailbody');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD
    },
});

async function sendEmail(to, subject, clientName, clientSubject, clientMassage, companyNumber, websiteLink) {
    try {
        const mailDetails = {
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            html: setConfirmEmailBody(clientName, clientSubject, clientMassage, companyNumber, websiteLink),
        };

        await transporter.sendMail(mailDetails);



    } catch (error) {
        console.log("Failed to send email:", error);
    }
}

module.exports = sendEmail;

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const dotenv = require('dotenv');

dotenv.config();

const otpCache = {};

// Function to generate a random string ...
const generateOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
};

// Function to send OTP via email ...
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.APP_EMAIL,
        to: email,
        subject: 'OTP Verification - Gamage Recruiters',
        text:`Your OTP for email verification is ${otp}`
    };

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // Disable certificate validation ...
        }
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log('Error occurred while sending OTP:', error);
            return;
        } else {
            console.log('OTP sent successfully:', info.response);
        }
    }); 
}; 

module.exports = { otpCache, generateOTP, sendOTP };
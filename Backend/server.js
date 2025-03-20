const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const { dbconnect } = require('./config/dbConnection');
const userRoute = require('./Routers/userRoute');
const adminRoute = require('./Routers/adminRoute');
const googleAuthRoute = require('./Routers/googleAuthRoute');
const facebookAuthRoute = require('./Routers/facebookAuthRoute');
const linkedInAuthRoute = require('./Routers/LinkedInAuthRoute');

require('dotenv').config();
require('./auth/passportAuthGoogle');
require('./auth/passportAuthFacebook');
require('./auth/passportAuthLinkedIn');

const app = express();

const PORT = process.env.PORT || 5000;

dbconnect();  ///database Connecting 

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, '/uploads/images')));
app.use('/uploads/cv', express.static(path.join(__dirname, '/uploads/cvs')));

app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const contactRouter = require('./Routers/contactRouter');
app.use("/api/contact",contactRouter);
app.use('/user', userRoute);
app.use('/admin', adminRoute)
app.use('/', googleAuthRoute);
app.use('/', facebookAuthRoute);
app.use('/', linkedInAuthRoute)

const testimonialsRouter = require('./Routers/testimonialsRouter');
app.use("/api/testimonials",testimonialsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

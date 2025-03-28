const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const { dbconnect } = require('./config/dbConnection');
const userRouter = require('./Routers/userRouter');
const authRouter = require('./Routers/authRouter');
const adminRouter = require('./Routers/adminRouter');
const sessionRouter = require('./Routers/sessionRouter');
const googleAuthRouter = require('./Routers/googleAuthRouter');
const facebookAuthRouter = require('./Routers/facebookAuthRouter');
const linkedInAuthRouter = require('./Routers/linkedInAuthRouter');

require('dotenv').config();
require('./auth/passportAuthGoogle');
require('./auth/passportAuthFacebook');
require('./auth/passportAuthLinkedIn');

const app = express();

const PORT = process.env.PORT || 5000;

dbconnect();  ///database Connecting 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, '/uploads/images')));
app.use('/uploads/cv', express.static(path.join(__dirname, '/uploads/cvs')));

app.use(session({ 
    key: "GamageRecruiters",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day ...
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const contactRouter = require('./Routers/contactRouter');
app.use("/api/contact",contactRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/session', sessionRouter);
app.use('/', googleAuthRouter);
app.use('/', facebookAuthRouter);
app.use('/', linkedInAuthRouter);

const testimonialsRouter = require('./Routers/testimonialsRouter');
app.use("/api/testimonials",testimonialsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

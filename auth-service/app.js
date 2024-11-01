const express = require('express');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
require('./config/passport'); // Initializing passport config

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);

module.exports = app;

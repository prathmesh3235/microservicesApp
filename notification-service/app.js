const express = require('express');
const cors = require('cors');
require('dotenv').config();
const notificationRoutes = require('./routes/notification');
const requestRoutes = require('./routes/request');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/notification', notificationRoutes);
app.use('/request', requestRoutes);


module.exports = app;

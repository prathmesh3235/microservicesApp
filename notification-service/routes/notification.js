const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Utility function to send email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };
    return transporter.sendMail(mailOptions);
};

// Route to send login notification
router.post('/send-login-notification', async (req, res) => {
    console.log('Received login notification request:', req.body);
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const subject = 'Login Notification - Request Management System';
        const text = `Hello,\n\nYou have successfully logged into the Request Management System.\n\nIf you did not perform this action, please contact your administrator immediately.`;

        await sendEmail(email, subject, text);
        console.log('Login notification sent successfully to:', email);
        
        res.status(200).json({ 
            message: 'Login notification sent successfully',
            email: email
        });
    } catch (error) {
        console.error('Error sending login notification:', error);
        res.status(500).json({ 
            message: 'Failed to send login notification',
            error: error.message 
        });
    }
});

// Route to send status update notification
router.post('/send-status-update-notification', async (req, res) => {
    console.log('Received status update notification request:', req.body);
    const { requesterEmail, approverEmail, requestTitle, status } = req.body;

    if (!requesterEmail || !approverEmail || !requestTitle || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const statusCap = status.charAt(0).toUpperCase() + status.slice(1);
        
        // Email for requester
        const requesterSubject = `Request ${statusCap}`;
        const requesterText = `Your request "${requestTitle}" has been ${status} by the approver.`;

        // Email for approver
        const approverSubject = `Request Status Updated`;
        const approverText = `You have ${status} the request "${requestTitle}" submitted by ${requesterEmail}.`;

        // Send both emails
        await Promise.all([
            sendEmail(requesterEmail, requesterSubject, requesterText),
            sendEmail(approverEmail, approverSubject, approverText)
        ]);

        console.log('Status update notifications sent successfully');
        res.status(200).json({ message: 'Status update notifications sent successfully' });
    } catch (error) {
        console.error('Error sending status update notifications:', error);
        res.status(500).json({ 
            message: 'Failed to send status update notifications',
            error: error.message 
        });
    }
});

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        service: 'notification-service',
        time: new Date().toISOString()
    });
});

module.exports = router;
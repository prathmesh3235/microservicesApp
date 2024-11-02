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
    },
    logger: true,
    debug: true 
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
    const { email, name } = req.body;
    const subject = 'Successful Login Notification';
    const text = `Hello ${name},\n\nYou have successfully logged into the application.`;

    try {
        await sendEmail(email, subject, text);
        res.status(200).json({ message: 'Login notification sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send login notification' });
    }
});

// Route to send request creation notification
router.post('/send-request-notification', async (req, res) => {
    const { requesterEmail, approverEmail, requestTitle } = req.body;

    try {
        // Email details for the requester
        const requesterSubject = 'Request Created Successfully';
        const requesterText = `Your request titled "${requestTitle}" has been created successfully and is pending approval.`;

        // Email details for the approver
        const approverSubject = 'New Request Requires Your Approval';
        const approverText = `A new request titled "${requestTitle}" has been created by the requester and requires your approval. Please review it at your earliest convenience.`;

        // Send email to requester
        await sendEmail(requesterEmail, requesterSubject, requesterText);
        await sendEmail(approverEmail, approverSubject, approverText);

        // Send email to approver
        res.status(200).json({ message: 'Request creation notification sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send request notification' });
    }
});


// Route to send approval notification
router.post('/send-approval-notification', async (req, res) => {
    const { requesterEmail, approverEmail, requestTitle } = req.body;
    const subject = 'Request Approval Notification';
    const text = `The request titled "${requestTitle}" has been approved by the approver.`;

    try {
        await sendEmail(requesterEmail, subject, text);
        await sendEmail(approverEmail, subject, text);
        res.status(200).json({ message: 'Approval notification sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send approval notification' });
    }
});

module.exports = router;

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Request = require('../models/Request');
const router = express.Router();
require('dotenv').config();

// Route to create a new request
router.post('/create', async (req, res) => {
    const { title, description, type, urgency, requesterEmail, approverEmail } = req.body;

    // Check if all fields are provided
    if (!title || !description || !type || !urgency || !requesterEmail || !approverEmail) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        // Create and save request
        const newRequest = new Request({ title, description, type, urgency, requesterEmail, approverEmail });
        await newRequest.save();

        // Notify requester and approver
        await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send-request-notification`, {
            requesterEmail,
            approverEmail,
            requestTitle: title
        });

        res.status(201).json({ message: 'Request created and notifications sent', request: newRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Failed to create request' });
    }
});

// Route to approve a request
router.put('/approve/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid request ID' });
    }
    
    try {
        const updatedRequest = await Request.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send-approval-notification`, {
            requesterEmail: updatedRequest.requesterEmail,
            approverEmail: updatedRequest.approverEmail,
            requestTitle: updatedRequest.title
        });

        res.status(200).json({ message: 'Request approved and notifications sent', request: updatedRequest });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ message: 'Failed to approve request' });
    }
});

module.exports = router;

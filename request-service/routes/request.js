const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Request = require('../models/Request');
const router = express.Router();
require('dotenv').config();

// Route to create a new request
router.post('/create', async (req, res) => {
    const { title, requesterEmail, approverEmail } = req.body;
    
    try {

        // Notify requester and approver
        const response = await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send-request-notification`, {
            requesterEmail,
            approverEmail,
            requestTitle: title
        });

        res.status(201).json({ message: 'Request created and notifications sent', request: response.data });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Failed to create request' });
    }
});

// Route to approve a request
router.put('/approve/:id', async (req, res) => {
    const { id } = req.params;

    // Validate that `id` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid request ID' });
    }
    
    try {
        // Update request status to "Approved"
        const updatedRequest = await Request.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Notify requester and approver of approval
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

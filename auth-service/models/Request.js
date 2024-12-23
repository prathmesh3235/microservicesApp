const mongoose = require('mongoose');

// Request schema
const requestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    urgency: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    approverEmail: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);

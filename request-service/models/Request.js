const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Leave', 'Equipment', 'Overtime'], required: true },
    urgency: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    requesterEmail: { type: String, required: true },
    approverEmail: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

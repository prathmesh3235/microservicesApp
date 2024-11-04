const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    token: { type: String, required: true },
    email: { type: String, required: true },
    isManager: { type: Boolean, default: false },
});

module.exports = mongoose.model('Users', userSchema);

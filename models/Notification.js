const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    toEmail: {
        type: String,
        required: true
    },
    fromEmail: {
        type: String, // Optional: who triggered it (e.g. worker email)
        default: 'system'
    },
    actionRoute: {
        type: String, // Where clicking the notification should take the user
        default: '/'
    },
    time: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);

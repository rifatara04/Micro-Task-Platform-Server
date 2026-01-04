const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ toEmail: req.user.email })
            .sort({ time: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
};

// Mark a single notification as read (optional usage, maybe we auto-read all on view)
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark as read', error: error.message });
    }
};

// Internal Helper to create notification (not an API endpoint usually, but imported by other controllers)
exports.createNotificationInternal = async (toEmail, message, actionRoute, fromEmail = 'system') => {
    try {
        await Notification.create({
            toEmail,
            message,
            actionRoute,
            fromEmail
        });
    } catch (error) {
        console.error("Notification creation failed:", error);
    }
};

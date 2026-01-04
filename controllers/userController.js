const User = require('../models/User');
const Task = require('../models/Task');
const Payment = require('../models/Payment'); // Verify if models exist or use placeholders if needed

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['worker', 'buyer', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
        req.params.id, 
        { role }, 
        { new: true }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Admin Stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        
        // Use aggregation to sum coins
        const coinsData = await User.aggregate([
            { $group: { _id: null, totalCoins: { $sum: "$coins" } } }
        ]);
        const totalCoins = coinsData.length > 0 ? coinsData[0].totalCoins : 0;

        const paymentsData = await Payment.aggregate([{ $group: { _id: null, totalAmount: { $sum: "$amount" } } }]);
        const totalPayments = paymentsData.length > 0 ? paymentsData[0].totalAmount : 0;

        res.json({
            totalUsers,
            totalCoins,
            totalPayments
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Best Workers (Public)
exports.getBestWorkers = async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' })
            .sort({ coins: -1 })
            .limit(6)
            .select('name email photo coins'); // Select only necessary fields
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

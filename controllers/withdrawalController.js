const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// Create withdrawal request (Worker only)
exports.createWithdrawal = async (req, res) => {
  try {
    const { withdrawal_coin, payment_system, account_number } = req.body;
    const worker_email = req.user.email;
    const worker_name = req.user.name;

    // Check minimum withdrawal amount (200 coins)
    if (withdrawal_coin < 200) {
      return res.status(400).json({ message: 'Minimum withdrawal is 200 coins' });
    }

    // Check user balance
    const user = await User.findOne({ email: worker_email });
    if (!user || user.coins < withdrawal_coin) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Calculate dollar amount (20 coins = $1)
    const withdrawal_amount = withdrawal_coin / 20;

    const withdrawal = await Withdrawal.create({
      worker_email,
      worker_name,
      withdrawal_coin,
      withdrawal_amount,
      payment_system,
      account_number,
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending withdrawals (Admin only)
exports.getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: 'pending' }).sort({ withdraw_date: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve withdrawal (Admin only)
exports.approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    
    if (withdrawal.status === 'approved') {
        return res.status(400).json({ message: 'Requests already approved' });
    }

    // Deduct coins from worker
    const worker = await User.findOne({ email: withdrawal.worker_email });
    if (worker) {
        if (worker.coins < withdrawal.withdrawal_coin) {
             return res.status(400).json({ message: 'Worker no longer has enough coins' });
        }
        worker.coins -= withdrawal.withdrawal_coin;
        await worker.save();
    }

    withdrawal.status = 'approved';
    await withdrawal.save();

    res.json({ message: 'Withdrawal approved and coins deducted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

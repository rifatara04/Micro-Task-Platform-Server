const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const User = require('../models/User');

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { coins, price } = req.body;
        
        // Calculate amount in cents
        const amount = parseInt(price * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card']
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
};

// Save Payment Info and Update User Coins
exports.savePaymentInfo = async (req, res) => {
    try {
        const { paymentIntentId, coins, amount } = req.body;
        
        // Verify user exists
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create Payment Record
        const payment = await Payment.create({
            userId: user._id,
            email: user.email,
            transactionId: paymentIntentId,
            amount: amount,
            coins: coins
        });

        // Update User Coins
        user.coins = (user.coins || 0) + coins;
        await user.save();

        res.json({ success: true, message: 'Payment successful and coins added', payment });

    } catch (error) {
        console.error("Save Payment Error:", error);
        res.status(500).json({ message: 'Failed to save payment', error: error.message });
    }
};

// Get Payment History
exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ email: req.params.email }).sort({ date: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
    }
};

const express = require('express');
const router = express.Router();
const { 
    createPaymentIntent, 
    savePaymentInfo,
    getPaymentHistory 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/save-payment', protect, savePaymentInfo);
router.get('/:email', protect, getPaymentHistory);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
    createWithdrawal, 
    getPendingWithdrawals, 
    approveWithdrawal 
} = require('../controllers/withdrawalController');
const { protect } = require('../middleware/auth');
// We should add verifyAdmin middleware soon

router.post('/', protect, createWithdrawal);
router.get('/pending', protect, getPendingWithdrawals); // Add verifyAdmin
router.patch('/:id/approve', protect, approveWithdrawal); // Add verifyAdmin

module.exports = router;

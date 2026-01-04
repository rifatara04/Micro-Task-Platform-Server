const express = require('express');
const router = express.Router();
const { 
    createSubmission, 
    getWorkerSubmissions, 
    getBuyerSubmissions, 
    approveSubmission, 
    rejectSubmission 
} = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createSubmission);
router.get('/worker/:email', protect, getWorkerSubmissions);
router.get('/buyer/:email', protect, getBuyerSubmissions);
router.patch('/:id/approve', protect, approveSubmission);
router.patch('/:id/reject', protect, rejectSubmission);

module.exports = router;

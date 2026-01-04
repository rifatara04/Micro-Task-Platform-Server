const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    updateUserRole, 
    deleteUser,
    getAdminStats,
    getBestWorkers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public Routes
router.get('/best', getBestWorkers);

// All routes below here should be protected and admin only
router.use(protect);
router.use(verifyAdmin);

router.get('/', getAllUsers);
router.get('/stats', getAdminStats);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { registerUser, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // We need to create this middleware

router.post('/register', registerUser);
router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);

module.exports = router;

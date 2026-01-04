const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, role, photo, firebaseUid } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Assign initial coins
    let coins = 0;
    if (role === 'worker') coins = 10;
    if (role === 'buyer') coins = 50;

    const user = await User.create({
      name,
      email,
      role,
      photo,
      coins,
      firebaseUid,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        photo: user.photo,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user / Google Sign In
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { name, email, photo, firebaseUid } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // User exists, return user data
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        photo: user.photo,
        token: generateToken(user._id),
      });
    } else {
      // User doesn't exist, create new user (Default role needed or handle on frontend?)
      // For Google Sign In, we might need to ask for role if it's a new user. 
      // Assuming frontend handles rol selection for new Google users or we default to Worker.
      // However, requirements say "Drop-down to select the role" for registration.
      // For Google login on registration page, we should pass the role.
      
      const role = req.body.role || 'worker'; // Default to worker if not specified
      
      let coins = 0;
      if (role === 'worker') coins = 10;
      if (role === 'buyer') coins = 50;

      user = await User.create({
        name,
        email,
        role,
        photo,
        coins,
        firebaseUid,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        photo: user.photo,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        photo: user.photo,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, googleLogin, getMe };

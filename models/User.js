const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['worker', 'buyer', 'admin'],
    required: true,
  },
  photo: {
    type: String,
  },
  coins: {
    type: Number,
    default: 0,
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

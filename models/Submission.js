const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  task_title: {
    type: String,
    required: true,
  },
  payable_amount: {
    type: Number,
    required: true,
  },
  worker_email: {
    type: String,
    required: true,
  },
  worker_name: {
    type: String,
    required: true,
  },
  buyer_email: {
    type: String,
    required: true,
  },
  buyer_name: {
    type: String,
    required: true,
  },
  submission_details: {
    type: String,
    required: true,
  },
  screenshot_url: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submission_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);

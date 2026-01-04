const Submission = require('../models/Submission');
const Task = require('../models/Task');
const User = require('../models/User');

// Create a new submission (Worker only)
exports.createSubmission = async (req, res) => {
  try {
    const {
      task_id,
      task_title,
      payable_amount,
      buyer_email,
      buyer_name,
      submission_details,
    } = req.body;

    const worker_email = req.user.email;
    const worker_name = req.user.name;

    // Check if task exists and has slots
    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.required_workers <= 0) return res.status(400).json({ message: 'No slots available' });

    // Create submission
    const submission = await Submission.create({
      task_id,
      task_title,
      payable_amount,
      worker_email,
      worker_name,
      buyer_email,
      buyer_name,
      submission_details,
    });

    // Decrease task required_workers
    task.required_workers -= 1;
    await task.save();

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get submissions by worker email
exports.getWorkerSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ worker_email: req.params.email }).sort({ submission_date: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get submissions by buyer email (for pending reviews)
exports.getBuyerSubmissions = async (req, res) => {
  try {
    // Usually buyers want to see 'pending' submissions first
    const submissions = await Submission.find({ buyer_email: req.params.email }).sort({ submission_date: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve Submission (Buyer only)
exports.approveSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    if (submission.status !== 'pending') {
        return res.status(400).json({ message: 'Submission already processed' });
    }

    // Get buyer and worker
    const buyer = await User.findOne({ email: submission.buyer_email });
    const worker = await User.findOne({ email: submission.worker_email });

    if (!buyer) {
        return res.status(404).json({ message: 'Buyer not found' });
    }

    if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
    }

    // Check if buyer has enough coins
    if (buyer.coins < submission.payable_amount) {
        return res.status(400).json({ message: 'Buyer has insufficient coins' });
    }

    // Update submission status
    submission.status = 'approved';
    await submission.save();

    // Deduct coins from buyer
    buyer.coins -= submission.payable_amount;
    await buyer.save();

    // Add coins to worker
    worker.coins += submission.payable_amount;
    await worker.save();

    res.json({ 
        message: 'Submission approved and coins transferred',
        buyer_coins: buyer.coins,
        worker_coins: worker.coins
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject Submission (Buyer only)
exports.rejectSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    if (submission.status !== 'pending') {
        return res.status(400).json({ message: 'Submission already processed' });
    }

    // Update submission status
    submission.status = 'rejected';
    await submission.save();

    // Increase task required_workers (slot becomes available again)
    const task = await Task.findById(submission.task_id);
    if (task) {
        task.required_workers += 1;
        await task.save();
    }

    res.json({ message: 'Submission rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

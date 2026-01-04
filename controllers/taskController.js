const Task = require('../models/Task');
const User = require('../models/User');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      task_title,
      task_detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
    } = req.body;

    const buyer_email = req.user.email; 
    const buyer_name = req.user.name;

    // Calculate total cost
    const totalCost = required_workers * payable_amount;

    // Check user coins
    const user = await User.findOne({ email: buyer_email });
    if (user.coins < totalCost) {
      return res.status(400).json({ message: 'Not enough coins. Please purchase more.' });
    }

    // Deduct coins
    user.coins -= totalCost;
    await user.save();

    const task = await Task.create({
      task_title,
      task_detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
      buyer_email,
      buyer_name,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all tasks (for workers - only available ones)
exports.getAllTasks = async (req, res) => {
  try {
    // Filter tasks where required_workers > 0
    const tasks = await Task.find({ required_workers: { $gt: 0 } }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get tasks by buyer email
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ buyer_email: req.params.email }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single task details
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Refund coins for remaining required_workers
    const refundAmount = task.required_workers * task.payable_amount;
    
    // Find buyer and refund
    const user = await User.findOne({ email: task.buyer_email });
    if(user) {
        user.coins += refundAmount;
        await user.save();
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted and remaining coins refunded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task (Basic update)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

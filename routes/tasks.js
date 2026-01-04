const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getAllTasks, 
    getMyTasks, 
    deleteTask, 
    getTask,
    updateTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
// We can add verifyBuyer/verifyWorker middleware here later

router.post('/', protect, createTask);
router.get('/', getAllTasks); // Open for now, or protect
router.get('/buyer/:email', protect, getMyTasks);
router.get('/:id', protect, getTask);
router.delete('/:id', protect, deleteTask);
router.patch('/:id', protect, updateTask);

module.exports = router;

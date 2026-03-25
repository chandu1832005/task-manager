const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  deleteTask
} = require('../controllers/taskController');

router.use(protect);

router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.put('/reorder', reorderTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.put('/:id/status', updateTaskStatus);

module.exports = router;

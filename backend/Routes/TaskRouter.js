const express = require('express');
const { createTask, getAllTasks, updateTask, deleteTask } = require('../Controllers/TaskController');
const { createTaskValidation, updateTaskValidation } = require('../Middlewares/TaskValidation');
const ensureAuthenticated = require('../Middlewares/Auth');
const router = express.Router();

router.post('/tasks', ensureAuthenticated, createTaskValidation, createTask);
router.get('/tasks', ensureAuthenticated, getAllTasks);
router.put('/tasks/:id', ensureAuthenticated, updateTaskValidation, updateTask);
router.delete('/tasks/:id', ensureAuthenticated, deleteTask);

module.exports = router;

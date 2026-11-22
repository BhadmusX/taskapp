const express = require('express');
const router = express.Router();
const {
    createTask,
    getTask,
    getTaskById,
    updateTask,
    deleteTask,
    getUserStat
} = require('../controllers/taskController.js');

router.post('/create', createTask);
router.get('/get/:id', getTaskById);
router.get('/get/stat/user/:id', getUserStat);
router.get('/get', getTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);


module.exports = router;
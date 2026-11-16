const express = require('express');
const router = express.Router();
const {createUser, getUserById, getUsers, updateUser, deleteUser} = require('../controllers/userController.js');


router.post('/create', createUser);
router.get('/get/:id', getUserById);
router.get('/get', getUsers);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
module.exports = router;
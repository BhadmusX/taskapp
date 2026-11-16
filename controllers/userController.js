const userModel = require('../models/userModel.js');

const createUser = async (req, res) => {
    try{
        const {firstName, lastName, age} = req.body;
        console.log(firstName, lastName, age)

        if(!firstName || !lastName || !age){
            return res.status(400).json({success: false, message: "Fill all fields"});
        }

        const response = await userModel.createUser({firstName, lastName, age});

        return res.status(201).json({success: true, user: response, message: "User created"});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const getUserById = async (req, res) => {
    try{
        const id = req.params.id;

        if(!id){
            return res.status(400).json({success: false, message: "include id in params"})
        }

        const response = await userModel.getUserById(id);
        return res.status(200).json({success: true, user: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const updateUser = async (req, res) => {
    try{
        const id = req.params.id;
        const {firstName, lastName, age} = req.body;

        if(!firstName || !lastName || !age){
            return res.status(400).json({success: false, message: "Fill in all details"});
        }

        if(!id){
            return res.status(400).json({success: false, message: "Include id"})
        }

        const response = await userModel.updateUser({id, firstName, lastName, age});
        return res.status(200).json({success: true, message: "User updated successfully", user: response})
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

const getUsers = async (req, res) => {
    try{
        const response = await userModel.getUsers();
        return res.status(200).json({success: true, users: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const response = await userModel.deleteUser(id);
        return res.status(200).json({success: true, message: "User deleted successfully", user: response})
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

module.exports = {createUser, getUserById, updateUser, getUsers, deleteUser};
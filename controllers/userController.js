const userModel = require('../models/userModel.js');
const validator = require('validator');
const createUser = async (req, res) => {
    try{
        const {firstName, lastName, age, email} = req.body;
        console.log(firstName, lastName, age, email)


        let trimmedEmail;
        let trimmedFirstName;
        let trimmedLastName;

        if(email){
            if(typeof email !== 'string'){
                return res.status(400).json({success: false, message: "Email must be a string"})
            }

            trimmedEmail = email.toLowerCase().trim();

            if(!validator.isEmail(trimmedEmail)){
                return res.status(400).json({success: false, message: "Invalid email"});
            }
            
        }

        if(firstName){
            if(typeof firstName !== 'string'){
                return res.status(400).json({success: false, message: "firstName must be a string"});
            }
            trimmedFirstName = firstName.trim();
        }

        if(lastName){
            if(typeof lastName !== "string"){
                return res.status(400).json({success: false, message: "lastName must be a string"});
            }
            trimmedLastName = lastName.trim();
        }

        if(age){
            if(!Number.isInteger(age) || age < 1){
                return res.status(400).json({success: false, message: "Age must be a whole number and greater than zero"})
            }

        }

        if(!trimmedFirstName || !trimmedLastName || !age || !trimmedEmail){
            return res.status(400).json({success: false, message: "Fill all fields"});
        }

        

        const userInfo = await userModel.getUserByEmail(trimmedEmail);

        if(userInfo){
            return res.status(409).json({success: false, message: "Email already exists"});
        }

        const response = await userModel.createUser({firstName: trimmedFirstName, lastName: trimmedLastName, age, email: trimmedEmail});

        return res.status(201).json({success: true, user: response, message: "User created"});
    }catch(err){
        console.log(err);
        if(err.code === '23505'){
            return res.status(409).json({success: false, message: "Email already exists"})
        }
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
        const {firstName, lastName, age, email} = req.body;

       
        let trimmedEmail;
        let trimmedFirstName;
        let trimmedLastName;

        if(firstName){

        if(typeof firstName !== 'string'){
            return res.status(400).json({success: false, message: "firstName must be a string"});
        }

        trimmedFirstName = firstName.trim();
    }

    if(lastName){
        if(typeof lastName !== 'string'){
            return res.status(400).json({success: false, message: "lastName must be  a string"});
        }

        trimmedLastName = lastName.trim();
    }


        if(email){
            if(typeof email !== 'string'){
                return res.status(400).json({success: false, message: "email must be a string"});
            }

            trimmedEmail = email.toLowerCase().trim();

            if(!validator.isEmail(trimmedEmail)){
                return res.status(400).json({success: false, message: "Invalid email"});
            }
        }

        if(!Number.isInteger(age) || age < 1){
            return res.status(400).json({success: false, message: "age must be a whole number and must be greater than zero"})
        }

        if(!id){
            return res.status(400).json({success: false, message: "Include id"})
        }

         if(!trimmedFirstName || !trimmedLastName || !age || !trimmedEmail){
            return res.status(400).json({success: false, message: "Fill in all details"});
        }

        


        const response = await userModel.updateUser({id, firstName: trimmedFirstName, lastName: trimmedLastName, age, email: trimmedEmail});

        if(!response){
            return res.status(404).json({success: false, message: "User not found"});
        }
        return res.status(200).json({success: true, message: "User updated successfully", user: response})
    }catch(err){
        console.log(err);
        if(err.code === '23505'){
            return res.status(409).json({success: false, message: "Email already exists"})
        }
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
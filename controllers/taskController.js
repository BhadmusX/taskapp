const  taskModel = require('../models/taskModel.js');

const createTask = async (req, res) => {
    try{
        const {taskName, userId} = req.body;
        if(!userId){
            return res.status(400).json({success: false, message: "UserId is not provided"});
        }

        if(!taskName){
            return res.status(400).json({success: false, message: "Task name is not provided"});
        }

        const response = await taskModel.createTask({taskName, userId});
        return res.status(201).json({success: true, message: "Task created successfully", task: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const getTask = async (req, res) => {
    try{
        const response = await taskModel.getTasks();
        return res.status(200).json({success: true, tasks: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const getTaskById = async (req, res) => {
    try{
        const taskId = req.params.id;

        if(!taskId){
            return res.status(400).json({success: false, message: "taskId is not provided"});
        }

        const response = await taskModel.getTaskById(taskId);
        return res.status(200).json({success: true, task: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const deleteTask = async (req, res) => {
    try{
        const taskId = req.params.id;

        if(!taskId){
            return res.status(400).json({success: false, message: "taskId is not provided"});
        }

        const response = await taskModel.deleteTask(taskId);
        return res.status(200).json({success: true, task: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const updateTask = async (req, res) => {
    try{
        const taskId = req.params.id;
        const {taskName, stat} = req.body;

        if(!taskId){
            return res.status(400).json({success: false, message: "taskId is not provided"});
        }

        if(taskName === undefined && stat === undefined){
            return res.status(400).json({success: false, message: "Nothing to update"})
        }


        let trimmedTaskName;

        if(taskName !== undefined){
            if(typeof taskName !== "string"){
                return res.status(400).json({success: false, message: "taskName must be a string"});
            }
            
            trimmedTaskName = taskName.trim();

        }

        if(stat !== undefined){
            if(typeof stat !== 'boolean'){
                return res.status(400).json({success: false, message: "stat must be a boolean"});
            }
        }

        const response = await taskModel.updateTask({taskId, taskName: trimmedTaskName, stat});
        if(!response){
            return res.status(404).json({success: false, message: "Task not found"});
        }
        return res.status(200).json({success: true, message: "Task updated successfully", task: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

module.exports = {createTask, getTask, getTaskById, deleteTask, updateTask};
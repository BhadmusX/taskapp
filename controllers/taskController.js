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
        const {stat, limit, page} = req.query;
        const {id} = req.params;
        const filter = {};
        const DEFAULT_LIMIT = 10;
        const MAX_LIMIT = 100;
        let parsedLimit = DEFAULT_LIMIT;
        let parsedPage = 1;
        let parsedUserId;
        console.log()

        if(limit !== undefined){
            parsedLimit = Number(limit);

            if(!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT){
                return res.status(400).json({success: false, message: `limit must be a whole number and between 1 and ${MAX_LIMIT}`})
            }
        }

        if(page !== undefined){
            parsedPage = Number(page);

            if(!Number.isSafeInteger(parsedPage) || parsedPage < 1){
                return res.status(400).json({success: false, message: "page must be a whole number and atleast 1"})
            }
        }
 
        filter.limit = parsedLimit;

        const skip = (parsedPage -1) * parsedLimit;
        filter.skip = skip;

        let boolStat;
        if(stat !== undefined){
            if(stat !== "true" && stat !== "false"){
            return res.status(400).json({success: false, message: "stat must be a true or false"})
        }
        boolStat = stat === "true";
        filter.stat = boolStat;
        }

        if(id !== undefined){
            parsedUserId = Number(id);
            if(!Number.isInteger(parsedUserId) || parsedUserId < 1){
            return res.status(400).json({success: false, message: "userId must be a whole number and atleast 1"})
        }
        filter.userId = parsedUserId;
        }

        const response = await taskModel.getTasks(filter);
        return res.status(200).json({success: true, tasks: response});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Something went wrong"});
    }
}

const getTaskById = async (req, res) => {
    try{

        const {taskId, userId} = req.params;
        let parsedTaskId;
        let parsedUserId;

        if(taskId === undefined){
            return res.status(400).json({success: false, message: "taskId must be provided"})
        }

        if(userId === undefined){
            return res.status(400).json({success: false, message: "userId must be provided"});
        }

        if(taskId !== undefined){
            parsedTaskId = Number(taskId);
            if(!Number.isInteger(parsedTaskId) || parsedTaskId < 1){
                return res.status(400).json({success: false, message: "taskId must be a whole number and greater than 1"})
            }
            
        }

        if(userId !== undefined){
            parsedUserId = Number(userId);
            if(!Number.isInteger(parsedUserId) || parsedUserId < 1){
                return res.status(400).json({success: false, message: "userId must be a whole number and greater than 1"})
            }
        }

        const response = await taskModel.getTaskById({taskId: parsedTaskId, userId: parsedUserId});
        if(!response){
            return res.status(404).json({success: false, message: "Task not found"})
        }
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

const getUserStat = async (req, res) => {
    try{
    const {id} = req.params;
    console.log(id);

    if(id === undefined){
        return res.status(400).json({success: false, message: "id must be passed"});
    }

    if(!Number.isInteger(id) || id < 1){
        return res.status(400).json({success: false, message: "id must be a whole number and be greater than 1"});
    }
    console.log(id);

    const result = await taskModel.getUserStat({id});
    res.status(200).json({success: true, tasks: result});
}catch(err){
    console.log(err);
    return res.status(500).json({success: false, message: "Something went wrong"})
}


}



module.exports = {createTask, getTask, getTaskById, deleteTask, updateTask, getUserStat};
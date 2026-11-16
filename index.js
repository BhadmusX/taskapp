require('dotenv').config();
const port = (process.env.PORT || 3000);
const express = require('express');
const app = express();
app.use(express.json());

const userRouter = require('./routes/userRoute.js');
const taskRouter = require('./routes/taskRoute.js');
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const express = require('express');
const app = express();
const AuthRouter = require('./Routes/AuthRouter');
const cors = require('cors');
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 5000;
const taskRoutes = require('./Routes/TaskRouter');

app.use(express.json());
app.use(cors());
app.use('/api/auth', AuthRouter);
app.use('/api', taskRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});
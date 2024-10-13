const express = require('express');
const connectDB = require('./database/db');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/PostRoutes');
const friendRoutes = require('./Routes/friendRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Welcome to Social Media Backend Api")
})
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

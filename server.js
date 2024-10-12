const express = require('express');
const connectDB = require('./database/db');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/PostRoutes');
const friendRoutes = require('./Routes/friendRoutes');
require('dotenv').config();

const app = express();
connectDB();


app.use(cors({
    origin: 'https://social-media-beryl-tau.vercel.app/', // Update to your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true,
  }));
app.use(express.json());
// app.get('/',(req,res)=>{
//     res.send("Hello")
// })
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

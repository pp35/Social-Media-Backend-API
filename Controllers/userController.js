const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
   
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
  

      const newUser = new User({
        username,
        email,
        password: hashedPassword 
      });
  
     
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ error: 'Server error' })
    }
  };
  

const sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
      
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        receiver.friendRequests.push(senderId);
        await receiver.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
       
        const friend = await User.findById(friendId);

        
        if (!user.friendRequests.includes(friendId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }

        
        user.friends.push(friendId);
       
        user.friendRequests = user.friendRequests.filter(id => id !== friendId);

        await user.save();
        await friend.save(); 

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
     
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  };

module.exports = {
    registerUser,
    loginUser,
    sendFriendRequest,
    acceptFriendRequest,
};

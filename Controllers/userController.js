const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
  
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Attempting to log in:', email); 

        const user = await User.findOne({ email });
        console.log('Retrieved user:', user); 
        if (!user) {
            console.log('User not found'); 
            return res.status(400).json({ message: 'Invalid credentials' });
        }

    
        if (!password || !user.password) {
            console.error('Password or hashed password is undefined');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

      
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

       
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error.message); 
        res.status(500).json({ message: 'Server error', error: error.message });
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
       
        const user = await User.findById(userId);
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



module.exports = {
    registerUser,
    loginUser,
    sendFriendRequest,
    acceptFriendRequest,
};

// Controllers/userController.js

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
        return res.status(500).json({ error: 'Server error' });
    }
};

const sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: 'User not found' });
        }

        receiver.friendRequests.push(senderId);
        await receiver.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        const user = await User.findById(userId); // Fetch the user from the database
        const friend = await User.findById(friendId); // Fetch the friend from the database

        if (!user || !friend) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.friendRequests.includes(friendId)) {
            return res.status(400).json({ error: 'No friend request from this user' });
        }

        user.friends.push(friendId);
        user.friendRequests = user.friendRequests.filter(id => id !== friendId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token }); // Send token back
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    sendFriendRequest,
    acceptFriendRequest,
};

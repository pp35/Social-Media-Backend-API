const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
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

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Attempting to log in:', email); // Log the attempt

        const user = await User.findOne({ email });
        console.log('Retrieved user:', user); // Log the retrieved user object
        if (!user) {
            console.log('User not found'); // Log if user is not found
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Ensure password is defined
        if (!password || !user.password) {
            console.error('Password or hashed password is undefined');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch'); // Log if passwords do not match
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and send JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Send a friend request
const sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add senderId to receiver's friend requests
        receiver.friendRequests.push(senderId);
        await receiver.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Accept a friend request
const acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        // Find the user who will accept the friend request
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        // Check if friend request exists
        if (!user.friendRequests.includes(friendId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }

        // Add friendId to user's friends
        user.friends.push(friendId);
        // Remove friendId from user's friend requests
        user.friendRequests = user.friendRequests.filter(id => id !== friendId);

        await user.save();
        await friend.save(); // Ensure friend document is updated if needed

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

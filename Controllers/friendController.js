const User = require('../models/User');
const FriendRequest = require('../models/friendRequest');

// Send Friend Request
exports.sendFriendRequest = async (req, res) => {
    const { friendId } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).send('User not found');
        if (user.friends.includes(friendId)) return res.status(400).send('Already friends');

        // Check if friend request already exists
        const existingRequest = await FriendRequest.findOne({ sender: user._id, receiver: friendId });
        if (existingRequest) return res.status(400).send('Friend request already sent');

        // Create a new friend request
        const newFriendRequest = new FriendRequest({
            sender: user._id,
            receiver: friend._id,
        });

        await newFriendRequest.save();
        res.send('Friend request sent');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await FriendRequest.findById(requestId).populate('sender receiver');
        if (!friendRequest) return res.status(404).send('Friend request not found');

        const { sender, receiver } = friendRequest;

        // Add each other as friends
        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        // Update the status of the friend request
        friendRequest.status = 'accepted';
        await friendRequest.save();

        res.send('Friend request accepted');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject Friend Request
exports.rejectFriendRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) return res.status(404).send('Friend request not found');

        // Update the status to 'rejected'
        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.send('Friend request rejected');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

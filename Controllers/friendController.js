const User = require('../models/User');
const FriendRequest = require('../models/friendRequest');


exports.sendFriendRequest = async (req, res) => {
    const { friendId } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).send('User not found');
        if (user.friends.includes(friendId)) return res.status(400).send('Already friends');

    
        const existingRequest = await FriendRequest.findOne({ sender: user._id, receiver: friendId });
        if (existingRequest) return res.status(400).send('Friend request already sent');

 
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

exports.acceptFriendRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await FriendRequest.findById(requestId).populate('sender receiver');
        if (!friendRequest) return res.status(404).send('Friend request not found');

        const { sender, receiver } = friendRequest;

   
        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

      t
        friendRequest.status = 'accepted';
        await friendRequest.save();

        res.send('Friend request accepted');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.rejectFriendRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) return res.status(404).send('Friend request not found');


        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.send('Friend request rejected');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

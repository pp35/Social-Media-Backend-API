const FriendRequest = require('../models/friendRequest');
const User = require('../models/User');

const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body; // The ID of the user to send the request to
  const senderId = req.user.id; // Assuming you're using middleware to get the logged-in user's ID

  try {
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    const newRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
    await newRequest.save();

    return res.status(201).json({ message: 'Friend request sent' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    request.status = 'accepted';
    await request.save();

    return res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Optionally, you can remove the friend request from the database
    await FriendRequest.deleteOne({ _id: requestId });

    return res.status(200).json({ message: 'Friend request rejected' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest // Export the reject function
};

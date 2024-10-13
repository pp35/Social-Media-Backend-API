const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../Controllers/friendController');
const auth = require('../middleware/authMiddleware'); // Ensure you have an auth middleware for JWT validation

// Send a friend request
router.post('/send-friend-request', auth, sendFriendRequest);

// Accept a friend request
router.post('/accept-friend-request', auth, acceptFriendRequest);

// Reject a friend request
router.post('/reject-friend-request', auth, rejectFriendRequest);

module.exports = router;

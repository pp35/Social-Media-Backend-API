const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../Controllers/friendController');
const auth = require('../middleware/authMiddleware'); // Ensure you have an auth middleware for JWT validation

router.post('/send-friend-request', auth, sendFriendRequest);


router.post('/accept-friend-request', auth, acceptFriendRequest);


router.post('/reject-friend-request', auth, rejectFriendRequest);

module.exports = router;

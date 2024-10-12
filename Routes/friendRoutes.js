const express = require('express');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../Controllers/friendController');
const auth = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/send', auth, sendFriendRequest); 
router.post('/accept', auth, acceptFriendRequest); 
router.post('/reject', auth, rejectFriendRequest); 

module.exports = router;

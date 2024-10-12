const express = require('express');
const { createPost, addComment, likePost, getFeed } = require('../Controllers/PostController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, createPost);
router.post('/comment', auth, addComment);
router.post('/like', auth, likePost); 
router.get('/feed', auth, getFeed);

module.exports = router;

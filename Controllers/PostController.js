const Post = require('../models/Post');
const User = require('../models/User');

// Create a Post
exports.createPost = async (req, res) => {
    const { content } = req.body;

    try {
        const post = new Post({ user: req.user.id, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Comment to a Post
exports.addComment = async (req, res) => {
    const { postId, content } = req.body;

    try {
        const post = await Post.findById(postId);
        post.comments.push({ user: req.user.id, content });
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like a Post
exports.likePost = async (req, res) => {
    const { postId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Feed Posts
exports.getFeed = async (req, res) => {
    try {
        // Log authenticated user's ID
        console.log('Authenticated User ID:', req.user.id);

        // Fetch the user and their friends
        const user = await User.findById(req.user.id).populate('friends', '_id username');
        console.log('User Friends:', user.friends);

        // Get the IDs of the friends
        const friendIds = user.friends.map(friend => friend._id);
        console.log('Friend IDs:', friendIds);
        
        if (friendIds.length === 0) {
            return res.status(200).json([]); // No friends, return empty feed
        }

        // Fetch posts by the user's friends
        const posts = await Post.find({ user: { $in: friendIds } }).populate('user', 'username');
        console.log('Posts fetched:', posts);  // Log the fetched posts

        res.json(posts);
    } catch (error) {
        console.error('Error fetching feed:', error.message);
        res.status(500).json({ message: error.message });
    }
};



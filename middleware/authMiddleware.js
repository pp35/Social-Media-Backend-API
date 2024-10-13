const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header('Authorization');
    
    // Check if token exists
    if (!token) return res.status(401).send('Access denied. No token provided.');

    // Ensure the token starts with "Bearer" and extract the token part
    if (token.startsWith('Bearer ')) {
        // Remove "Bearer " from the token string
        const jwtToken = token.slice(7, token.length).trim();

        try {
            // Verify the token with the JWT secret
            const verified = jwt.verify(jwtToken, process.env.JWT_SECRET);
            req.user = verified;  // Attach the verified user information to the request object
            next();  // Proceed to the next middleware or route handler
        } catch (err) {
            return res.status(400).send('Invalid token');
        }
    } else {
        return res.status(400).send('Invalid token format');
    }
};

module.exports = auth;

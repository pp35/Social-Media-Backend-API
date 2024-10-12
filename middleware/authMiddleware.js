const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    
    const token = req.header('Authorization');
    
    
    if (!token) return res.status(401).send('Access denied. No token provided.');

  
    if (token.startsWith('Bearer ')) {
   
        const jwtToken = token.slice(7, token.length).trim();

        try {
           
            const verified = jwt.verify(jwtToken, process.env.JWT_SECRET);
            req.user = verified;  
            next();  
        } catch (err) {
            return res.status(400).send('Invalid token');
        }
    } else {
        return res.status(400).send('Invalid token format');
    }
};

module.exports = auth;

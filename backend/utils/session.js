const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            role: user.role,
            username: user.username 
        },
        process.env.SESSION_SECRET,
        { expiresIn: '1h' }
    );
};

const refreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        return jwt.sign(decoded, process.env.SESSION_SECRET, { expiresIn: '1h' });
    } catch (err) {
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, refreshToken }; 
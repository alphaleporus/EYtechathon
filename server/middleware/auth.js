const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: {message: 'Access token required', status: 401}});
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({error: {message: 'Invalid or expired token', status: 403}});
    }
}

function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: {message: 'Insufficient permissions', status: 403}
            });
        }
        next();
    };
}

module.exports = {authenticateToken, authorizeRole};

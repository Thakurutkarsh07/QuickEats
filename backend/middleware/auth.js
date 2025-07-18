import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided. Access denied."
        });
    }
    
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET environment variable is not defined');
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }
        
        const token_decode = jwt.verify(token, jwtSecret);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Access denied."
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Authentication error"
            });
        }
    }
};

export default authMiddleware;
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token =
        authHeader &&
        authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Access Denied"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ||
            "your_fallback_jwt_secret_key"
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({
            error: "Invalid Token"
        });
    }
}

module.exports = authenticateToken;
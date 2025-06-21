import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;

        const token = cookieToken || (authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        // ✅ Check if token is blacklisted in Redis
        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
        }

        // ✅ Decode JWT and attach user to request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.token = token; // useful if you want to log or revoke later
        next();

    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};

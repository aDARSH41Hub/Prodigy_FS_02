const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../errors/AppError");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return next(
                new AppError(
                    "Not authorized. No token provided.",
                    401,
                    "UNAUTHORIZED"
                )
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return next(
                new AppError(
                    "Not authorized. No token provided.",
                    401,
                    "UNAUTHORIZED"
                )
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select(
            "-passwordHash"
        );

        if (!user) {
            return next(
                new AppError(
                    "Not authorized. User not found.",
                    401,
                    "UNAUTHORIZED"
                )
            );
        }

        if (!user.isActive) {
            return next(
                new AppError(
                    "User account is inactive.",
                    403,
                    "ACCOUNT_INACTIVE"
                )
            );
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(
                new AppError(
                    "Not authorized. Invalid token.",
                    401,
                    "INVALID_TOKEN"
                )
            );
        }

        if (error.name === "TokenExpiredError") {
            return next(
                new AppError(
                    "Not authorized. Token expired.",
                    401,
                    "TOKEN_EXPIRED"
                )
            );
        }

        next(error);
    }
};

module.exports = {
    protect,
};
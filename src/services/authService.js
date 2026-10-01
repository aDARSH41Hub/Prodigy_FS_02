const userRepository = require("../repositories/userRepository");
const signToken = require("../utils/generateToken");
const AppError = require("../errors/AppError");

/**
 * Register a new user.
 */
const signup = async ({ name, email, password }) => {
    try {
        const user = await userRepository.createUser({
            name,
            email,
            passwordHash: password,
        });

        return user;
    } catch (error) {
        // Duplicate email
        if (error.code === 11000) {
            throw new AppError(
                "A user with this email already exists.",
                409,
                "USER_EMAIL_EXISTS"
            );
        }

        throw error;
    }
};

/**
 * Authenticate a user and generate a JWT.
 */
const login = async ({ email, password }) => {
    const user = await userRepository.findByEmail(
        email,
        true
    );

    // Do not reveal whether the email exists.
    if (!user) {
        throw new AppError(
            "Invalid email or password.",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    // Prevent inactive accounts from logging in.
    if (!user.isActive) {
        throw new AppError(
            "This account is inactive.",
            403,
            "ACCOUNT_INACTIVE"
        );
    }

    // Verify password.
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new AppError(
            "Invalid email or password.",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    // Generate JWT.
    const token = signToken(user._id, user.role);

    return {
        token,
        user,
    };
};

module.exports = {
    signup,
    login,
};
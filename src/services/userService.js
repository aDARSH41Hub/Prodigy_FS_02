const AppError = require("../errors/AppError");
const userRepository = require("../repositories/userRepository");

const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(
            "User not found.",
            404,
            "USER_NOT_FOUND"
        );
    }

    return user;
};

const getAdminDashboardAccess = async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(
            "User not found.",
            404,
            "USER_NOT_FOUND"
        );
    }

    if (user.role !== "admin") {
        throw new AppError(
            "Admin access required.",
            403,
            "FORBIDDEN"
        );
    }

    if (!user.isActive) {
        throw new AppError(
            "User account is inactive.",
            403,
            "ACCOUNT_INACTIVE"
        );
    }

    return user;
};

module.exports = {
    getProfile,
    getAdminDashboardAccess,
};
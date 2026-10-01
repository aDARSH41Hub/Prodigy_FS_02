const userService = require("../services/userService");


const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user._id);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const getAdminAccess = async (req, res, next) => {
    try {
        await userService.getAdminDashboardAccess(req.user._id);

        return res.status(200).json({
            success: true,
            message: "Welcome Admin!",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    getAdminAccess,
};
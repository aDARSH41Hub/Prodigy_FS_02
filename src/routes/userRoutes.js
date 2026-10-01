const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
    getProfile,
    getAdminAccess,
} = require("../controllers/userController");

// All user routes require authentication.
router.use(protect);

// Logged-in users only.
router.get("/profile", getProfile);

// Admin only.
router.get(
    "/admin",
    authorize("admin"),
    getAdminAccess
);

module.exports = router;
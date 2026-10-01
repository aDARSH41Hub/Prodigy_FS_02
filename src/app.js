const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

function createApp() {
    const app = express();

    // Global middleware
    app.use(cors());
    app.use(express.json());

    // API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/employees", employeeRoutes);

    // Health check
    app.get("/health", (req, res) => {
        return res.status(200).json({
            success: true,
            status: "ok",
        });
    });

    // 404 handler
    app.use(notFound);

    // Centralized error handler
    app.use(errorHandler);

    return app;
}

module.exports = {
    createApp,
};
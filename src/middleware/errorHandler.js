const AppError = require("../errors/AppError");

function errorHandler(err, req, res, next) {
    // Operational/application errors
    if (err instanceof AppError) {
        const errorResponse = {
            success: false,
            error: {
                code: err.code,
                message: err.message
            }
        };

        if (err.details) {
            errorResponse.error.details = err.details;
       }
       return res.status(err.statusCode).json(errorResponse);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request data"
            }
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            error: {
                code: "DUPLICATE_RESOURCE",
                message: "A resource with the provided value already exists"
            }
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            error: {
                code: "INVALID_ID",
                message: "Invalid resource ID"
            }
        });
    }
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            error: {
                code: "INVALID_JSON",
                message: "Request body contains invalid JSON"
         }
        });
   }

    // Unexpected errors
    return res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred"
        }
    });
}

module.exports = errorHandler;
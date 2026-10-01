const AppError = require("../errors/AppError");

function notFound(req, res, next) {
    const error = new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`,
        404,
        "ROUTE_NOT_FOUND"
    );

    next(error);
}

module.exports = notFound;
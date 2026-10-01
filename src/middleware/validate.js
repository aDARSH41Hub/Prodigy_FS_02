const AppError = require("../errors/AppError");

function validate(schema, source = "body") {
    return (req, res, next) => {
        const input = req[source] ?? {};

        const result = schema.safeParse(input);

        if (!result.success) {
            const details = result.error.issues.map(
                (issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })
            );

            return next(
                new AppError(
                    "Request validation failed.",
                    400,
                    "VALIDATION_ERROR",
                    details
                )
            );
        }

        if (source === "query") {
            req.validatedQuery = result.data;
        } else if (source === "params") {
            req.validatedParams = result.data;
        } else {
            req.body = result.data;
        }

        next();
    };
}

module.exports = validate;
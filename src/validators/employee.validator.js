const { z } = require("zod");

/*
|--------------------------------------------------------------------------
| Common employee fields
|--------------------------------------------------------------------------
*/

const employeeFields = {
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name cannot exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Please provide a valid email address.")
        .transform((value) => value.toLowerCase()),

    position: z
        .string()
        .trim()
        .min(2, "Position must be at least 2 characters.")
        .max(100, "Position cannot exceed 100 characters."),

    department: z
        .string()
        .trim()
        .min(2, "Department must be at least 2 characters.")
        .max(100, "Department cannot exceed 100 characters."),

    salary: z
        .number({
            error: "Salary must be a number.",
        })
        .min(0, "Salary cannot be negative."),
};

/*
|--------------------------------------------------------------------------
| Create employee
|--------------------------------------------------------------------------
*/

const createEmployeeSchema = z
    .object(employeeFields)
    .strict();

/*
|--------------------------------------------------------------------------
| Update employee
|--------------------------------------------------------------------------
|
| Partial update, but at least one legitimate employee field is required.
| Unknown fields such as createdBy, __v, deletedAt, etc. are rejected.
|--------------------------------------------------------------------------
*/

const updateEmployeeSchema = z
    .object(employeeFields)
    .partial()
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required for update.",
        }
    );

/*
|--------------------------------------------------------------------------
| Employee query
|--------------------------------------------------------------------------
*/

const employeeQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10),

    search: z
        .string()
        .trim()
        .max(100)
        .default(""),
});

/*
|--------------------------------------------------------------------------
| Employee ID
|--------------------------------------------------------------------------
*/

const employeeIdSchema = z.object({
    id: z
        .string()
        .regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid employee ID."
        ),
}).strict();

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
    employeeQuerySchema,
    employeeIdSchema,
};
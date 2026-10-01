const { z } = require("zod");

const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long.")
        .max(50, "Name must not exceed 50 characters."),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(128, "Password must not exceed 128 characters."),
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),
});

module.exports = {
    signupSchema,
    loginSchema,
};
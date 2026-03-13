const { z } = require("zod");

const signupSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(255, { message: "Username must not be more than 255 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must not be more than 255 characters" }),
  phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(1024, "Password can't be greater than 1024 characters"),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(1024, "Password can't be greater than 1024 characters"),
});

module.exports = { signupSchema, loginSchema };

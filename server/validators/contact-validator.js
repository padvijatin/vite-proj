const { z } = require("zod");

const contactSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(255, { message: "Username must not be more than 255 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" }),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, { message: "Message is required" })
    .max(2000, { message: "Message must not be more than 2000 characters" }),
});

module.exports = contactSchema;

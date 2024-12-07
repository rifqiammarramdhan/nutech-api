const { z } = require("zod");

const userSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .refine((val) => val !== null && val !== undefined, "First name cannot be null or undefined"),

  last_name: z.string(),

  email: z
    .string()
    .email("Invalid email format")
    .refine((val) => val !== null && val !== undefined, "Email cannot be null or undefined"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .refine((val) => val !== null && val !== undefined, "Password cannot be null or undefined"),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Paramter email tidak sesuai format")
    .refine((val) => val !== null && val !== undefined, "Email cannot be null or undefined"),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});

module.exports = { userSchema, loginSchema };

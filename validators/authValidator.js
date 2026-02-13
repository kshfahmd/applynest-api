const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must be less than 64 characters")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least 1 special character");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[A-Za-z ]+$/, "Name can only contain letters and spaces");

const emailSchema = z
  .string()
  .trim()
  .email("Invalid email format")
  .transform((val) => val.toLowerCase());

const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required").max(64),
  })
  .strict();

const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

const { z } = require("zod");

const jobStatusEnum = ["applied", "interview", "offer", "rejected"];

const createJobSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name cannot exceed 100 characters"),

    role: z
      .string()
      .trim()
      .min(2, "Role must be at least 2 characters")
      .max(100, "Role cannot exceed 100 characters"),

    status: z.enum(jobStatusEnum).optional(),

    location: z
      .string()
      .trim()
      .max(100, "Location cannot exceed 100 characters")
      .optional(),

    notes: z
      .string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
  })
  .strict();

const updateJobSchema = createJobSchema.partial();

module.exports = {
  createJobSchema,
  updateJobSchema,
};

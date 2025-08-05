import { z } from "zod"

const schema = z.object({
  email: z
    .email("Please enter a valid email address (e.g., name@example.com).")
    .max(255, "Email must be 255 characters or less."),
  password: z
    .string()
    .min(8, "Please enter a valid password with at least 8 characters.")
    .max(128, "Password must be 128 characters or less."),
})

export const schemaAuth = z.object({
  email: schema.shape.email,
  password: schema.shape.password,
})

export type TypeAuth = z.infer<typeof schemaAuth>

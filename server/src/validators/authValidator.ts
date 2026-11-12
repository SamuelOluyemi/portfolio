import { z } from "zod";

export const loginSchema = z.object({
  email: z
  .string()
  .trim()
  .email("A valid email address is required.")
  .max(254),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password is too long."),
});

export type LoginInput = z.infer<typeof loginSchema>;

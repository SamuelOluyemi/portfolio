import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(254, "Email cannot exceed 254 characters"),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must contain at least 3 characters")
    .max(200, "Subject cannot exceed 200 characters"),

  message: z
    .string()
    .trim()
    .min(10, "Message must contain at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

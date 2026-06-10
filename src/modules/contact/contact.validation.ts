import { z } from "zod";

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    contact: z.string().min(8),
    message: z.string().optional()
  }),
});

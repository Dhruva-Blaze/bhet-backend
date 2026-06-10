import { z } from "zod";

export const upsertPricingSchema = z.object({
  params: z.object({
    productId: z.string().min(1),
  }),
  body: z.object({
    pricing: z.array(
      z.object({
        role: z.enum(["CLIENT", "VENDOR", "USER"]),
        price: z.number().positive(),
      }),
    ),
  }),
});

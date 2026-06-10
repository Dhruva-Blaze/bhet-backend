import { z } from "zod";

export const createFilterGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    scope: z.enum(["GLOBAL", "CATEGORY"]),
    categoryId: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    options: z.array(z.string()).optional(),
  }).superRefine((data, ctx) => {
    if (data.scope === "CATEGORY" && !data.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryId"],
        message: "categoryId is required for CATEGORY scope",
      });
    }
  })
});

import { z } from "zod";

export const createFilterOptionSchema = z.object({
  filterGroupId: z.string().min(1, "Filter group is required"),
  label: z.string().min(1, "Label is required"),
});

export const updateFilterOptionSchema = z.object({
  label: z.string().min(1, "Label is required").optional(),

  isActive: z.boolean().optional(),
});

export const listFilterOptionSchema = z.object({
  filterGroupId: z.string().min(1),
});

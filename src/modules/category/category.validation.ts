import z from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    slug: z.string().min(2, "Slug must be at least 2 characters long"),
    parentCategoryId: z.string().optional(),
    isActive: z.preprocess(
      (v) => (v === 'true' ? true : v === 'false' ? false : v),
      z.boolean().optional()
    ),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").optional(),
    slug: z.string().min(2, "Slug must be at least 2 characters long").optional(),
    parentCategoryId: z.string().optional(),
    isActive: z.preprocess(
      (v) => (v === 'true' ? true : v === 'false' ? false : v),
      z.boolean().optional()
    ),
    isDeleted: z.preprocess(
      (v) => (v === 'true' ? true : v === 'false' ? false : v),
      z.boolean().optional()
    ),
  }),
});

export const listCategorySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    parentCategoryId: z.string().optional(),
    isActive: z.string().optional(),
    isDeleted: z.string().optional(),
  }),
});

export const getCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});
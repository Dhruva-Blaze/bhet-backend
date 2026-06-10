// modules/product/product.validation.ts

import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    content: z.string().min(5, "Content must be at least 5 characters"),
    price: z.coerce.number().min(0, "Price must be >= 0"),
    min_quantity: z.coerce.number().min(0, "Quantity must be >= 0"),
    product_status: z.enum(["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"]).default("IN_STOCK"),
    images: z.any().optional(),
    existingImages: z.any().optional(),
    primaryImageIndex: z.any().optional(),
    categoryId: z.any().optional(),
    categoryIds: z.any().optional(),
    subCategoryIds: z.any().optional(),
    filterOptionIds: z.any().optional(),
  }),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

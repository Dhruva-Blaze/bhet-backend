import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().email("Invalid email format"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    role: z.enum(["ADMIN", "CLIENT", "VENDOR", "USER"]).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),

    email: z.string().email().optional(),

    password: z.string().min(6).optional(),

    role: z.enum(["ADMIN", "CLIENT", "VENDOR", "USER"]).optional(),

    status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
  }),

  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const listUserSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum(["ADMIN", "CLIENT", "VENDOR", "USER"]).optional(),
    status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
    search: z.string().optional(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

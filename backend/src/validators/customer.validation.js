import { z } from "zod";

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3),

    phone: z.string().trim().min(10),

    email: z.string().email().optional(),

    birthDate: z.string().optional(),

    notes: z.string().optional(),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).optional(),

    phone: z.string().trim().min(10).optional(),

    email: z.string().email().optional(),

    birthDate: z.string().optional(),

    notes: z.string().optional(),
  }),
});

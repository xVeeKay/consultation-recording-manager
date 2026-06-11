import { z } from "zod";

export const createConsultationSchema = z.object({
  body: z.object({
    customerId: z.string(),

    title: z.string().trim().min(3),

    notes: z.string().optional(),

    consultationDate: z.string(),

    duration: z.number().optional(),

    tags: z.array(z.string()).optional(),
  }),
});

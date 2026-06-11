import { z } from "zod";

export const mongoIdSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
});

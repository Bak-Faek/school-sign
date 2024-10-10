import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string().max(100, {
    message: "The category name should not exceed 100 characters.",
  }),
});

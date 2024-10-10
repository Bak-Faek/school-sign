import { z } from "zod";

export const calendarFormSchema = z.object({
  title: z.string().max(100, {
    message: "The title should not exceed 100 characters.",
  }),
  date: z.date({
    required_error: "Invalid date.",
  }),
  // subjectId: z.number().min(1, {
  //   message: "Subject is mandatory",
  // }),
  // schoolId: z.number().optional(),
});

import { z } from "zod";

export const lessonSchema = z.object({
  name: z
    .string()
    .max(100, {
      message:
        "Le nom de l'établissement doit comporter au maximum 100 caractères.",
    })
    .min(3, {
      message:
        "Le nom de l'établissement doit comporter au minimum 3 caractères.",
    }),
  dateStart: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "La date de début doit être une date valide.",
  }),
  dateEnd: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "La date de fin doit être une date valide.",
  }),
  classId: z.number().optional(),
});

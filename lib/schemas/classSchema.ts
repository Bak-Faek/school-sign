import { z } from "zod";

export const classSchema = z.object({
  name: z.string().max(100, {
    message: "Le nom de class doit comporter au maximum 100 caractères.",
  }),
  schoolId: z.number().optional(), // Champ optionnel pour sélectionner un établissement existant
});

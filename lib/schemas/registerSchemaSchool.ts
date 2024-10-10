import { z } from "zod";

export const registerSchemaSchool = z.object({
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
  address: z
    .string()
    .max(255, {
      message: "L'adresse doit comporter au maximum 255 caractères.",
    })
    .min(3, {
      message: "L'adresse doit comporter au minimum 3 caractères.",
    }),
  zipcode: z.string().regex(/^\d{5}$/, {
    message: "Le code postal doit être composé de 5 chiffres.",
  }),
  city: z
    .string()
    .max(100, {
      message: "Le nom de ville doit comporter au maximum 100 caractères.",
    })
    .min(2, {
      message: "Le nom de ville doit comporter au minimum 2 caractères.",
    }),
  email: z.string().email({ message: "L'email doit être valide." }).max(255),
  password: z
    .string()
    .min(8, {
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    })
    .max(255, {
      message: "Le mot de passe doit comporter au maximum 255 caractères.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial parmi @$!%*?&.",
      },
    ),
  schoolId: z.number().optional(),
  role: z.enum(["STUDENT", "TEACHER", "SCHOOL"]).optional(),
});

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { registerSchemaUser } from "@/lib/schemas/registerSchemaUser"; // Assurez-vous que le schéma est adapté aux utilisateurs

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      // Validation des données d'entrée avec le schéma
      const data = registerSchemaUser.parse(req.body);

      // Vérification si l'email est déjà utilisé
      const existingUser = await prisma.user.findFirst({
        where: { email: data.email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Création de l'utilisateur
      const user = await prisma.user.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: hashedPassword,
        },
      });

      // Réponse réussie
      res.status(201).json({ user });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Gestion des erreurs spécifiques à Prisma
        return res.status(400).json({ error: "Database error" });
      }
      res.status(400).json({ error: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // Méthode non autorisée
    res.status(405).json({ error: "Method not allowed" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { createToken } from "@/lib/jwt"; // Assurez-vous que cette fonction accepte un schoolId
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { loginSchema } from "@/lib/schemas/loginSchema";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validation des données d'entrée
    const { email, password } = loginSchema.parse(req.body);

    // Récupération de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { school: true }, // Inclut l'école associée pour obtenir schoolId
    });

    // Vérification de l'utilisateur et du mot de passe
    if (user && (await bcrypt.compare(password, user.password))) {
      const schoolId = user.schoolId; // Récupère l'ID de l'école associée
      const role = user.role;
      const classId = user.classId;
      const firstname = user.firstname;
      const lastname = user.lastname;

      // Création du token avec userId et schoolId
      const token = await createToken({
        userId: user.id,
        schoolId,
        role,
        classId,
        firstname,
        lastname,
      });

      // Configuration du cookie avec le token
      const cookie = serialize("session", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 jour
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Envoi du cookie et du token dans la réponse
      res.setHeader("Set-Cookie", cookie);
      res.status(200).json({ token });
    } else {
      // Identifiants invalides
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } finally {
    await prisma.$disconnect();
  }
}

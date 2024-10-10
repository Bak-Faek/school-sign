import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/jwt"; // Votre utilitaire JWT pour décoder le token
import { getUserByToken } from "@/lib/getUserByToken"; // Fonction pour obtenir l'utilisateur à partir du token

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { userId } = await verifyToken(token);
    const user = await getUserByToken(userId);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

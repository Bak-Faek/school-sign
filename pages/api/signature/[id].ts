import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "DELETE":
      return handleDelete(req, res, id);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string | string[] | undefined,
) {
  try {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid signature ID" });
    }

    const signatureId = parseInt(id, 10);
    if (isNaN(signatureId)) {
      return res.status(400).json({ error: "Invalid signature ID" });
    }

    const sign = await prisma.sign.findUnique({
      where: { id: signatureId },
    });

    if (!sign) {
      return res.status(404).json({ error: "Signature not found" });
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "signatures",
      path.basename(sign.hashedSign),
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.sign.delete({
      where: { id: signatureId },
    });

    res.status(200).json({ message: "Signature successfully deleted" });
  } catch (error) {
    console.error("Error deleting signature:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

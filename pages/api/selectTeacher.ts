import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    switch (method) {
      case "PUT":
        return handlePut(req, res);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  }

// Handle PUT request - Update an existing teacher
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string, 10);
  const { classId } = req.body;

  try {
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (typeof classId === "undefined") {
      return res.status(400).json({ error: "classId is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        classId: classId,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

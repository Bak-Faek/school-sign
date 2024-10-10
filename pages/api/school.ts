import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt"; // Assurez-vous d'avoir une fonction pour vérifier le token
import { registerSchemaSchool } from "@/lib/schemas/registerSchemaSchool";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);

    case "PUT":
      return handlePut(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

// Handle GET request - Retrieve all teachers or teachers by classId
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    const token = req.cookies.session;
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = await verifyToken(token);
    const schoolId = payload.schoolId;

    if (!schoolId) {
      return res.status(400).json({ error: "School ID missing from token" });
    }

    if (id) {
      const schoolId = Number(id);
      if (isNaN(schoolId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const school = await prisma.school.findUnique({
        where: { id: schoolId },
      });

      if (!school) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ school });
    }

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (school) {
      res.status(200).json(school);
    } else {
      res.status(404).json({ error: "School not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

// Handle PUT request - Update an existing teacher
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const parsedBody = registerSchemaSchool.partial().parse(req.body);
    const updatedSchool = await prisma.school.update({
      where: { id: parseInt(id as string, 10) },
      data: parsedBody,
    });
    return res.status(200).json(updatedSchool);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid data or class not found" });
  }
}

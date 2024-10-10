import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

interface Lesson {
  name: string;
  dateStart: string;
  dateEnd: string;
  classId: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

// Handle GET request - Retrieve lessons based on user's classId
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = await verifyToken(tokenCookie);
    if (!payload || !payload.classId) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const classId = payload.classId;

    const lessons = await prisma.lesson.findMany({
      where: {
        classId: classId,
      },
    });

    res.status(200).json(lessons);
  } catch (error) {
    console.error("Error retrieving lessons:", error);
    res.status(500).json({ error: "Failed to retrieve lessons" });
  }
}

// Handle POST request - Add a new lesson
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = await verifyToken(tokenCookie);
    if (!payload || !payload.classId) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const classId = payload.classId;
    const { name, dateStart, dateEnd }: Lesson = req.body;

    if (!name || !dateStart || !dateEnd || classId === undefined) {
      return res.status(400).json({
        error:
          "Fields 'name', 'dateStart', 'dateEnd', and 'classId' are required.",
      });
    }

    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ error: "'dateStart' must be earlier than 'dateEnd'." });
    }

    const newLesson = await prisma.lesson.create({
      data: {
        name,
        dateStart: startDate,
        dateEnd: endDate,
        classId,
      },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: "Failed to create lesson" });
  }
}

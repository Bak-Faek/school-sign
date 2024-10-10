// next
import { NextApiRequest, NextApiResponse } from "next";

// prisma & zod
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { registerSchemaUser } from "@/lib/schemas/registerSchemaUser";
import { ZodError } from "zod";

import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

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
    case "PUT":
      return handlePut(req, res);
    // case "DELETE":
    //   return handleDelete(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
// Handle POST request - Add a new student
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // const { id } = req.query;

  try {
    // Validate input data
    const data = registerSchemaUser.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Get school and class ID from the token
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = await verifyToken(tokenCookie);

    const { schoolId } = payload;
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    if (!schoolId || !data.classId) {
      return res
        .status(400)
        .json({ error: "School ID or Class ID missing from token" });
    }

    // Check if class exists
    const classSection = await prisma.classsection.findUnique({
      where: { id: data.classId },
    });

    if (!classSection) {
      return res.status(400).json({ error: "Invalid class ID" });
    }

    // Create the user and associate with school and class
    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword,
        class: { connect: { id: data.classId } },
        school: { connect: { id: schoolId } },
        role: Role.STUDENT,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("API Error:", error);

    // Check for Prisma constraint violations (e.g., duplicate email)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        error.meta?.target.includes("email")
      ) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
    }

    // Default to internal server error for other unhandled exceptions
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

// Handle GET request - Retrieve all student or a single student by ID
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = await verifyToken(tokenCookie);
    const { schoolId, role } = payload;

    const classIdQuery = req.query.classid;
    let classId: number | undefined = undefined;

    if (typeof classIdQuery === "string") {
      classId = parseInt(classIdQuery, 10);
      if (isNaN(classId)) {
        return res.status(400).json({ error: "Invalid class ID format" });
      }
    } else if (Array.isArray(classIdQuery)) {
      classId = parseInt(classIdQuery[0], 10);
      if (isNaN(classId)) {
        return res.status(400).json({ error: "Invalid class ID format" });
      }
    }

    if (!schoolId) {
      return res.status(400).json({ error: "School ID missing from token" });
    }

    if (role === "STUDENT") {
      return res.status(403).json({
        error: "Access denied. You do not have the required permissions.",
      });
    }

    if (id) {
      const userId = Number(id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user });
    }

    const users = await prisma.user.findMany({
      where: {
        schoolId,
        classId: classId,
      },
    });

    return res.status(200).json({ users });
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

// Handle PUT request - Update an existing student
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const parsedBody = registerSchemaUser.partial().parse(req.body);
    const updatedclass = await prisma.user.update({
      where: { id: parseInt(id as string, 10) },
      data: parsedBody,
    });
    return res.status(200).json(updatedclass);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid data or class not found" });
  }
}
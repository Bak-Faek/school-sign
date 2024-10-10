import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { registerSchemaSchool } from "@/lib/schemas/registerSchemaSchool"; // Assurez-vous que le schéma est adapté aux utilisateurs
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const data = registerSchemaSchool.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);

      let school;
      if (data.schoolId) {
        school = await prisma.school.findUnique({
          where: { id: data.schoolId },
        });
      } else {
        school = await prisma.school.create({
          data: {
            name: data.name,
            address: data.address,
            zipcode: data.zipcode,
            city: data.city,
          },
        });
      }

      if (!school) {
        return res.status(400).json({ error: "School not found or created" });
      }

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          school: { connect: { id: school.id } },
          role: "SCHOOL",
        },
      });

      res.status(201).json({ user });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

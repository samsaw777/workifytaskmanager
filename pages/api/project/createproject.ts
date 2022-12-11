import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import nookies from "nookies";
import * as jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}
export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, name, isPrivate } = req.body;

    //Check for the token.
    const { token } = nookies.get({ req });

    const jwtToken: any = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: jwtToken.userId },
    });

    //  Check if the project exist with the same name.
    const isProject = await prisma.project.findFirst({ where: { name } });

    if (isProject) {
      throw new Error(`Project name already exists.`);
    }
    //create the project.

    const project = await prisma.project.create({
      data: {
        name,
        userId: userId,
        isPrivate,
        isBug: true,
        isScrum: true,
        isKanban: true,
        members: {
          create: {
            email: user?.email || "",
            userId: user?.id || "",
            profileImage: user?.profile || "",
            role: "ADMIN",
          },
        },
      },
    });

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { projectId, userId, userEmail, userProfile } = req.body;

    await prisma.members.create({
      data: {
        projectId: projectId,
        email: userEmail,
        userId: userId,
        profileImage: userProfile,
        role: "MEMBER",
      },
    });

    res.status(200).json("Member added to the project!");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { projectId, userId, userName, userProfile } = req.body;

    const member = await prisma.members.create({
      data: {
        projectId: projectId,
        username: userName,
        userId: userId,
        profileImage: userProfile,
        role: "MEMBER",
      },
    });

    res.status(200).json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

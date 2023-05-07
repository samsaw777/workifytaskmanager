import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { projectId, userId, userName, userProfile } = req.body;

    const isMember = await prisma.members.findFirst({
      where: {
        AND: [{ projectId: projectId }, { userId: userId }],
      },
    });

    if (isMember) {
      return res.send("Member has already joined the project!");
    }

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

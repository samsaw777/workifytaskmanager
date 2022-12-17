import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      type,
      username,
      issue,
      profile,
      userId,
      sectionId,
      sectionName,
      projectId,
    } = req.body;

    const createdissue = await prisma.issues.create({
      data: {
        type,
        username,
        profile,
        userId,
        sectionId,
        issue,
        sectionName,
        projectId,
      },
    });

    res.status(200).json(createdissue);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

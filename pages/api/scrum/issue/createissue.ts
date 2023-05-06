import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      type,
      username,
      title,
      description,
      profile,
      userId,
      sectionId,
      sectionName,
      projectId,
      sprintId,
      sprintName,
      isUnderStartSprint,
      createdAt,
      endAt,
    } = req.body;

    const totalIssues = await prisma.issues.findMany({
      where: {
        sectionId,
      },
    });

    const issuesLength = totalIssues.length > 0 ? totalIssues.length : 0;

    const createdissue = await prisma.issues.create({
      data: {
        type,
        username,
        profile,
        description,
        userId,
        sectionId,
        title,
        sectionName,
        projectId,
        position: issuesLength,
        sprintId,
        sprintName,
        isUnderStartSprint,
        createdAt,
        endAt,
      },
    });

    res.status(200).json(createdissue);
  } catch (error: any) {
    throw new Error(error);
  }
}

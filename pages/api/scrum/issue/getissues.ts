import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, getType } = req.body;

    let issues: any;

    if (getType == "Project") {
      issues = await prisma.issues.findMany({
        where: {
          projectId: id,
        },
      });
    } else {
      issues = await prisma.issues.findMany({
        where: {
          sectionId: id,
        },
      });
    }

    res.status(200).json(issues);
  } catch (error: any) {
    res.status(500).json(error);
  }
}

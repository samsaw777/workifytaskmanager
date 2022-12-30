import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;

    let issues: any;

    issues = await prisma.issues.findMany({
      where: {
        AND: [{ projectId: id }, { sprintName: "BACKLOG" }],
      },
      orderBy: {
        position: "asc",
      },
    });

    res.status(200).json(issues);
  } catch (error: any) {
    res.status(500).json(error);
  }
}

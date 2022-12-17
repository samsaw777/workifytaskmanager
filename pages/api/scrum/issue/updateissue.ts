import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { issueId, issue, type } = req.body;

    const updatedIssue = await prisma.issues.update({
      where: { id: issueId },
      data: {
        issue,
        type,
      },
    });

    res.status(200).json(updatedIssue);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

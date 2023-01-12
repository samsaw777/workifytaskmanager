import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { issueId, title, type, description } = req.body;

    const updatedIssue = await prisma.issues.update({
      where: { id: issueId },
      data: {
        title,
        type,
        description,
      },
    });

    res.status(200).json(updatedIssue);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

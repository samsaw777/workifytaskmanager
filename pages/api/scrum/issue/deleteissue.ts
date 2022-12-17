import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { issueId } = req.body;

    const deletedIssue = await prisma.issues.delete({
      where: { id: issueId },
    });

    res.status(200).json(deletedIssue);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

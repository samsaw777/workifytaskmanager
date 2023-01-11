import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { taskId, comment, username, userProfile } = req.body;

    if (!taskId || !comment) {
      throw new Error("No Task ID or Comment found!");
    }

    const newComment = await prisma.taskComments.create({
      data: {
        taskId,
        comment,
        userProfile,
        username,
      },
    });

    res.status(200).json(newComment);
  } catch (error: any) {
    res.status(400).json(error);
  }
}

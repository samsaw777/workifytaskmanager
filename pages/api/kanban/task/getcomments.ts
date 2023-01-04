import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { taskId } = req.body;

    if (!taskId) throw new Error("Task Id Not Found!");

    const comments = await prisma.taskComments.findMany({
      where: {
        taskId,
      },
    });

    res.status(200).json(comments);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
}

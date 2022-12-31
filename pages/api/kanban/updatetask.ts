import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { taskId, title } = req.body;

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
      },
    });

    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(400).send(error);
  }
}

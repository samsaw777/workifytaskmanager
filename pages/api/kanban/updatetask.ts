import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { taskId, value, type } = req.body;

    let updatedTask;

    if (type == "title") {
      updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          title: value,
        },
      });
    } else {
      updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          description: value,
        },
      });
    }

    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(400).send(error);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sectionId, taskId } = req.body;

    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    const tasks = await prisma.task.findMany({
      where: {
        sectionId: sectionId,
      },
      orderBy: {
        position: "asc",
      },
    });

    for (const key in tasks) {
      await prisma.task.update({
        where: {
          id: tasks[key].id,
        },
        data: {
          position: parseInt(key),
        },
      });
    }

    res.status(200).json(deletedTask);
  } catch (error: any) {
    res.status(400).send(error);
  }
}

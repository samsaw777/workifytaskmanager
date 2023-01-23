import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { taskId, value, type } = req.body;
  try {
    let updatedTask;
    if (req.method === "PATCH") {
      if (type == "title") {
        updatedTask = await prisma.task.update({
          where: {
            id: taskId,
          },
          data: {
            title: value,
          },
        });
      } else if (type === "assigned") {
        updatedTask = await prisma.task.update({
          where: {
            id: taskId,
          },
          data: {
            assignedTo: value,
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
    }

    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(400).send(error);
  }
}

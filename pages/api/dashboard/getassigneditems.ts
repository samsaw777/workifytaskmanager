import { NextApiResponse, NextApiRequest } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.body;

    const issues = await prisma.issues.findMany({
      where: {
        assignedTo: userId,
      },
    });

    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
      },
    });

    const combinedTasks = [...issues, ...tasks];

    res.status(200).send(combinedTasks);
  } catch (error) {
    res.status(200).send(error);
  }
}

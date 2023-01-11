import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sectionId, title, userId, username, profile } = req.body;

    const totalTask = await prisma.task.findMany({
      where: {
        sectionId: sectionId,
      },
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description: "",
        sectionId,
        userId,
        username,
        profile,
        position: totalTask.length > 0 ? totalTask.length : 0,
      },
    });

    res.status(200).json(newTask);
  } catch (error: any) {
    res.status(400).send(error);
  }
}

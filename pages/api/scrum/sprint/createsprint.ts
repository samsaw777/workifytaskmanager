import Error, { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sprintName, boardId } = req.body;

    const newSprint = await prisma.sprint.create({
      data: {
        sprintName,
        boardId,
      },
    });

    res.status(200).json(newSprint);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

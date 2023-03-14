import Error, { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sprintName, boardId, startDate, endDate } = req.body;

    const newSprint = await prisma.sprint.create({
      data: {
        sprintName,
        boardId,
        isUnderStartSprint: false,
        isPrimary: false,
        startDate,
        endDate,
      },
    });

    res.status(200).json(newSprint);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

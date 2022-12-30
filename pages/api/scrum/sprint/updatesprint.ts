import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sprintId, sprintName } = req.body;

    const updatedSprint = await prisma.sprint.update({
      where: {
        id: sprintId,
      },
      data: {
        sprintName,
      },
    });

    res.status(200).json(updatedSprint);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
}

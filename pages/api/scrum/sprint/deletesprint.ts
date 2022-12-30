import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sprintId } = req.body;

    const deletedSprint = await prisma.sprint.delete({
      where: {
        id: sprintId,
      },
    });

    res.status(200).json(deletedSprint);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
}

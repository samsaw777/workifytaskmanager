import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { boardId } = req.body;

    const sprints = await prisma.sprint.findMany({
      where: {
        boardId,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        issues: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    res.status(200).json(sprints);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

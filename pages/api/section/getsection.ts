import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { boardId } = req.body;

    const sections = await prisma.section.findMany({
      where: {
        boardId,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(sections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { projectId } = req.body;

    const members = await prisma.members.findMany({
      where: {
        projectId,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

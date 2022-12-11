import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { memberId } = req.body;

    const removedMember = await prisma.members.delete({
      where: {
        id: memberId,
      },
    });

    res.status(200).json(removedMember);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

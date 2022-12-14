import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { memberId } = req.body;

    const user = await prisma.members.update({
      where: {
        id: memberId,
      },
      data: {
        role: "MEMBER",
      },
    });

    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

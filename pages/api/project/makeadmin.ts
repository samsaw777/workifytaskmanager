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
        role: "ADMIN",
      },
    });

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
}

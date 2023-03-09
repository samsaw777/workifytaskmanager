import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.body;

  try {
    if (!userId) {
      throw new Error("No Request Body Was Found!");
    }

    const notification = await prisma.notifications.findMany({
      where: {
        userId,
      },
    });

    res.status(200).send(notification);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

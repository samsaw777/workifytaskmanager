import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { notificationId } = req.body;
  try {
    if (!notificationId) {
      throw new Error("Notification Id is missing!");
    }

    const removedNotification = await prisma.notifications.delete({
      where: {
        id: notificationId,
      },
    });

    res.status(200).send(removedNotification);
  } catch (error: any) {
    res.status(404).send(error.message);
  }
}

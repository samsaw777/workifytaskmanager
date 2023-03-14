import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { requestBody, userId, projectId } = req.body;

  try {
    if (!requestBody || !userId || !projectId) {
      throw new Error("No Request Body Was Found!");
    }

    const notification = await prisma.notifications.create({
      data: {
        title: requestBody,
        request: true,
        isPending: true,
        userId,
        projectId,
      },
    });

    res.status(200).send(notification);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

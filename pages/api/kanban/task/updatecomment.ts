import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { comment, id } = req.body;

    if (!comment || !id) {
      throw new Error("Either of comment or id is missing!");
    }

    const updatedComment = await prisma.taskComments.update({
      where: {
        id,
      },
      data: {
        comment,
      },
    });

    res.status(200).send(updatedComment);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;

    if (!id) {
      throw new Error("Id not found!");
    }

    const deletedComment = await prisma.issueComments.delete({
      where: {
        id,
      },
    });

    res.status(200).send(deletedComment);
  } catch (error: any) {
    res.status(400).send(error.message``);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { boardId } = req.body;

    //Create the section and keep the title empty.
    const section = await prisma.section.create({
      data: {
        boardId,
        title: "",
      },
    });

    res.status(200).json(section);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

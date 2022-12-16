import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { boardId, title, id } = req.body;

    //Check if the section is present or not.
    const isSection = await prisma.section.findFirst({
      where: {
        id,
      },
    });

    if (!isSection) {
      throw new Error("Section Not Found!");
    }

    //Check if the section with the same name exists.
    const section = await prisma.section.findFirst({
      where: {
        AND: [{ title }, { boardId }],
      },
    });

    if (section) {
      throw new Error("Section already Exits!");
    }

    //update project
    const updatedSection = await prisma.section.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });

    res.status(200).json(updatedSection);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

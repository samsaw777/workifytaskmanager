import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;

    //check if the section is present or not with the given id
    const isSection = await prisma.section.findFirst({
      where: {
        id,
      },
    });

    if (!isSection) {
      throw new Error("Section Not Found!");
    }

    //delete section
    const section = await prisma.section.delete({
      where: {
        id,
      },
    });

    res.status(200).json(section);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}

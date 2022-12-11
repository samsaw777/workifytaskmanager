import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, isPrivate, id } = req.body;
    //Check if the project exists.
    const isProject = await prisma.project.findFirst({
      where: { id },
    });

    if (!isProject) {
      throw new Error(`Project Not Found!`);
    }

    //Update project.
    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
        isPrivate,
      },
    });

    res.status(200).json({ message: "Project Details Updated!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

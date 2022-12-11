import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;

    //Check if the project does not exist!
    const isProject = await prisma.project.findFirst({
      where: {
        id,
      },
    });

    if (!isProject) {
      throw new Error(`Project does not exist!`);
    }

    // Delete Project.
    const project = await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({ message: "Project Deleted!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectName, projectStatus, projectId } = req.body;

  try {
    if (!projectId) {
      throw new Error("Project Id Is Missing!");
    }

    if (!projectName) {
      throw new Error("Project Name Is Missing!");
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: projectName,
        isPrivate: projectStatus,
      },
    });

    res.status(200).send(updatedProject);
  } catch (error: any) {
    res.status(404).send(error.message);
  }
}

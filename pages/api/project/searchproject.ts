import { NextApiResponse, NextApiRequest } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { projectName } = req.body;

    console.log(projectName);

    const projects = await prisma.project.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: projectName,
                  mode: "insensitive",
                },
              },
              { name: projectName },
            ],
          },
          { isPrivate: false },
        ],
      },
    });

    if (projects.length > 0) {
      res.status(200).send(projects);
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({ error: error.message });
  }
}

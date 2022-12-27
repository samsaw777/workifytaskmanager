import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    resourceList,
    destinationList,
    sprintResourceId,
    sprintDestinationId,
    sprintResourceName,
    sprintDestinationName,
  } = req.body;

  try {
    if (sprintDestinationId != sprintResourceId) {
      for (const key in resourceList) {
        const id = resourceList[key].id;
        await prisma.issues.update({
          where: {
            id,
          },
          data: {
            sprintName: sprintResourceName,
            sprintId: sprintResourceId,
            position: parseInt(key),
          },
        });
      }
    }

    for (const key in destinationList) {
      const id = destinationList[key].id;
      await prisma.issues.update({
        where: {
          id,
        },
        data: {
          sprintName: sprintDestinationName,
          sprintId: sprintDestinationId,
          position: parseInt(key),
        },
      });
    }

    res.status(200).json("Issues Updated!");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

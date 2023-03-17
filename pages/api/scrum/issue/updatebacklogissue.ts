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
    const resourceSprint = await prisma.sprint.findFirst({
      where: { id: sprintResourceId },
    });

    const destinationSprint = await prisma.sprint.findFirst({
      where: { id: sprintDestinationId },
    });

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
            endAt: resourceSprint?.endDate,
            createdAt: resourceSprint?.startDate
              ? resourceSprint.startDate
              : new Date(),
              isUnderStartSprint:resourceSprint?.isUnderStartSprint
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
          endAt: destinationSprint?.endDate,
          createdAt: destinationSprint?.startDate
            ? destinationSprint?.startDate
            : new Date(),
            isUnderStartSprint: destinationSprint?.isUnderStartSprint
        },
      });
    }

    res.status(200).json("Issues Updated!");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

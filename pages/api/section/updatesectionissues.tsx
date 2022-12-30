import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    resourceList,
    destinationList,
    sectionResourceId,
    sectionDestinationId,
    sectionResourceName,
    sectionDestinationName,
  } = req.body;

  try {
    if (sectionDestinationId != sectionResourceId) {
      for (const key in resourceList) {
        const id = resourceList[key].id;
        await prisma.issues.update({
          where: {
            id,
          },
          data: {
            sectionName: sectionResourceName,
            sectionId: sectionResourceId,
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
          sectionName: sectionDestinationName,
          sectionId: sectionDestinationId,
          position: parseInt(key),
        },
      });
    }

    res.status(200).json("Issues Updated!");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

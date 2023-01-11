import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId,
  } = req.body;
  //   const resourceListReverse = resourceList.reverse();
  //   const destinationListReverse = destinationList.reverse();

  try {
    if (resourceSectionId !== destinationSectionId) {
      for (const key in resourceList) {
        const id = resourceList[key].id;
        await prisma.task.update({
          where: {
            id,
          },
          data: {
            sectionId: resourceSectionId,
            position: parseInt(key),
          },
        });
      }
    }

    for (const key in destinationList) {
      const id = destinationList[key].id;
      await prisma.task.update({
        where: {
          id,
        },
        data: {
          sectionId: destinationSectionId,
          position: parseInt(key),
        },
      });
    }

    res.status(200).json("updated");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default handler;

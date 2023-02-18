import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sprintId, sprintName, updateStatus, startDate, endDate } = req.body;
    let updatedSprint;
    switch (updateStatus) {
      case "UPDATESPRINTNAME":
        updatedSprint = await prisma.sprint.update({
          where: {
            id: sprintId,
          },
          data: {
            sprintName,
          },
        });
        break;
      case "UPDATESPRINTDATE":
        updatedSprint = await prisma.sprint.update({
          where: {
            id: sprintId,
          },
          data: {
            startDate,
            endDate,
          },
        });
        break;
      case "UPDATESPRINTSTATUS":
        updatedSprint = await prisma.sprint.update({
          where: {
            id: sprintId,
          },
          data: {
            isUnderStartSprint: true,
            issues: {
              updateMany: {
                where: {
                  sprintId,
                },
                data: {
                  isUnderStartSprint: true,
                },
              },
            },
          },
        });

        break;
      default:
        return;
    }

    res.status(200).json(updatedSprint);
  } catch (error: any) {
    res.status(400).json(error.message);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { value, taskId, type, requestBody, projectId, boardId } = req.body;
  try {
    let updatedIssue;
    if (req.method === "PATCH") {
      if (type === "title") {
        updatedIssue = await prisma.issues.update({
          where: {
            id: taskId,
          },
          data: {
            title: value,
          },
        });
      } else if (type === "assigned") {
        const issueUpdated = await prisma.issues.update({
          where: {
            id: taskId,
          },
          data: {
            assignedTo: value,
          },
        });

        const notification = await prisma.notifications.create({
          data: {
            title: requestBody,
            request: false,
            isPending: false,
            userId: value,
            projectId,
          },
        });

        updatedIssue = {
          issueUpdated,
          notification,
        };
      } else {
        updatedIssue = await prisma.issues.update({
          where: {
            id: taskId,
          },
          data: {
            description: value,
          },
        });
      }
    }

    res.status(200).json(updatedIssue);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

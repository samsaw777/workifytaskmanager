import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { boardId, type } = req.body;

    const sections = await prisma.section.findMany({
      where: {
        boardId,
      },
      orderBy: {
        id: "asc",
      },

      include: {
        issues:
          type == "SCRUM"
            ? {
                where: {
                  isUnderStartSprint: false,
                  NOT: {
                    sprintName: "BACKLOG",
                  },
                },
                orderBy: {
                  position: "asc",
                },
                include: {
                  assignedUser: true,
                  labels: {
                    orderBy: {
                      id: "asc",
                    },
                  },
                },
              }
            : false,
        tasks:
          type == "KANBAN"
            ? {
                orderBy: {
                  position: "asc",
                },
                include: {
                  assignedUser: true,
                  labels: {
                    orderBy: {
                      id: "asc",
                    },
                  },
                },
              }
            : false,
      },
    });

    res.status(200).json(sections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

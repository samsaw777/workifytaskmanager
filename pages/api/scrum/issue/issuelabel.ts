import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, label } = req.body;

    if (!id || !label) {
      throw new Error("Either Taskid or Label not provided!");
    }

    const createdLabel = await prisma.issueLabels.create({
      data: {
        issueId: id,
        name: label,
      },
    });

    res.status(200).json(createdLabel);
  } catch (error: any) {
    res.status(400).json(error);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { labelId } = req.body;

    if (!labelId) {
      throw new Error("LabelId not provided!");
    }

    const deletedLabel = await prisma.issueLabels.delete({
      where: {
        id: labelId,
      },
    });

    res.status(200).json(deletedLabel);
  } catch (error: any) {
    res.status(400).json(error);
  }
}

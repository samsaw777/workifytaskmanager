import { NextApiResponse, NextApiRequest } from "next";
import prisma from "../../../lib/prisma";
import nookies from "nookies";
import * as jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.body;
    const { token } = nookies.get({ req });
    const jwtToken: any = jwt.verify(token, secret);

    const issues = await prisma.issues.findMany({
      where: {
        assignedTo: jwtToken.userId,
      },
    });

    // console.log(issues);

    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
      },
    });
    let combinedTasks;
    if (issues.length > 0 && tasks.length > 0) {
      combinedTasks = [...issues, ...tasks];
    } else if (issues.length > 0 && tasks.length == 0) {
      combinedTasks = [...issues];
    } else {
      combinedTasks = [...tasks];
    }

    res.status(200).send(combinedTasks);
  } catch (error) {
    res.status(200).send(error);
  }
}

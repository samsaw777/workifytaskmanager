import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import nookies from "nookies";
import * as jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = nookies.get({ req });
    const jwtToken: any = jwt.verify(token, secret);
    const Projects = await prisma.project.findMany({
      where: {
        userId: jwtToken.userId,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).send(Projects);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

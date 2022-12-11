import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import nookies from "nookies";
import * as jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token } = nookies.get({ req });
    const jwtToken: any = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: jwtToken.userId },
    });

    res.status(200).json(user);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

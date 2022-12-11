import { NextApiRequest, NextApiResponse } from "next";
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

    const keyword = req.query.search?.toString();

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                email: {
                  contains: keyword,
                },
              },
              {
                username: {
                  contains: keyword,
                },
              },
            ],
          },
          {
            NOT: {
              id: jwtToken.userId,
            },
          },
        ],
      },
    });

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

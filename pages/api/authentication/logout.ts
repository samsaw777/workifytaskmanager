import { NextApiRequest, NextApiResponse } from "next";
import Nookies from "nookies";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    //destroy the cookie
    await Nookies.destroy({ res }, "token", {
      path: "/",
    });

    res.status(200).json({ message: "Logged Out Sucessfully!" });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  console.log(req.method);

  res.status(200).json({ message: "Hello There!" });
}

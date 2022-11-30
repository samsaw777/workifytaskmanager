import { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";
import "../../../lib/passport";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
}

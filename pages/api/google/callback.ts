import passport from "passport";
import "../../../lib/passport";
import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {
  passport.authenticate("google", (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${urlFetcher()}/?a=auth_fail`);
    }

    // set the token in cookies.
    nookies.set({ res }, "token", info.token, {
      httpOnly: true,
      domain: process.env.SERVER_DOMAIN || undefined,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: true,
      path: "/",
    });

    res.redirect(`${urlFetcher()}/dashboard`);
  })(req, res, next);
}

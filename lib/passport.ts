import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import prisma from "./prisma";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { urlFetcher } from "../utils/Helper/urlFetcher";

// checking the environment variables.
const googleClientId = process.env.GOOGLE_CLIENT_ID;
if (!googleClientId) {
  throw new Error("No Client Id!");
}

const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!googleClientSecret) {
  throw new Error("No Client Secret!");
}

const jwtSceret = process.env.JWT_SECRET;
if (!jwtSceret) {
  throw new Error("No JWT token found");
}

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `${urlFetcher()}/api/google/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const isUser = await prisma.user.findFirst({
          where: {
            email: profile.email,
          },
        });

        if (!isUser) {
          //Create user account.

          const password = profile.email;
          // hashing the password.
          const bycrptedPassword = await bcrypt.hash(password, 10);

          const user = await prisma.user.create({
            data: {
              email: profile.email,
              profile: profile.picture,
              username: profile._json.name,
              password: bycrptedPassword,
            },
          });

          // creating the jwt token and storing it in cookies.
          const token = await jwt.sign(
            { userId: user.id },
            jwtSceret as string,
            {
              expiresIn: "7d",
            }
          );

          done(null, user, { message: "Auth sucessed!", token });
        } else {
          //Login using the existing user.
          const token = await jwt.sign(
            { userId: isUser.id },
            jwtSceret as string,
            {
              expiresIn: "7d",
            }
          );

          done(null, isUser, { message: "Auth sucessed!", token });
        }
      } catch (error: any) {
        console.error(error.message);
        done(error, false, { message: "Internal Error!" });
      }
    }
  )
);

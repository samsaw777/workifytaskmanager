import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import nookies from "nookies";
import prisma from "../../../lib/prisma";
import { signUpValidation } from "../../../utils/Validation/validation";
const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, username, password } = req.body;

    await signUpValidation.validate({ email, username, password });

    //Checking if user is already present...
    const isUserEmail = await prisma.user.findFirst({
      where: { email },
    });

    const isUserUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (isUserEmail) {
      throw new Error("Email already exits!");
    }

    if (isUserUsername) {
      throw new Error("Username already exits!");
    }
    // hashing the password.
    const bycrptedPassword = await bcrypt.hash(password, 10);

    // creating a new user.
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: bycrptedPassword,
        profile: "",
      },
    });

    // creating the jwt token and storing it in cookies.
    const token = jwt.sign({ userId: user.id }, secret as string, {
      expiresIn: "7d",
    });

    // Setting the cookies.
    nookies.set({ res }, "token", token, {
      httpOnly: true,
      domain: process.env.SERVER_DOMAIN || undefined,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: true,
      path: "/",
    });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

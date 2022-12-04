import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import nookies from "nookies";
import prisma from "../../../lib/prisma";
import { loginValidation } from "../../../utils/Validation/validation";

//Checking if JWT_SCERET is present or not.
const secret = process.env.JWT_SECRET;
if (!secret) {
  console.warn("NO JWT_SECRET DEFINED!");
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    //getting the email and password.
    const { email, password } = req.body;

    //Validationg email and password.`
    await loginValidation.validate({ email, password });

    //Find if the user does not exist.
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //Check if user is present or not.
    if (!user) {
      throw new Error("User not found!");
    }

    // Check for the password.
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error("Password is incorrect!");
    }

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

    res.status(200).json({ message: "User Logged In Sucessfully!" });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}

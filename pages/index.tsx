import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Nookies from "nookies";
import * as jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

const Home: NextPage = ({ loggedinUser }: any) => {
  console.log(loggedinUser);
  return <div>This is landing page.</div>;
};

export default Home;

export async function getServerSideProps(context: any) {
  const { req, res } = context;

  const cookie = Nookies.get({ req });

  if (!cookie.token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const jwtToken: any = jwt.verify(cookie.token, secret);

  const response = await prisma.user.findUnique({
    where: { id: jwtToken.userId },
  });

  const user: any = JSON.stringify(response);

  return {
    props: {
      loggedinUser: JSON.parse(user),
    },
  };
}

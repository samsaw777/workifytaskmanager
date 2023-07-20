import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Nookies from "nookies";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import * as jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const secret = process.env.JWT_SECRET || "workify";

if (!secret) {
  throw new Error("No Secret");
}

interface HomeProps {
  loggedinUser?: any; // Adjust the type accordingly based on the actual user data structure
}

const Home: NextPage<HomeProps> = ({ loggedinUser }) => {
  return <div>This is the landing page.</div>;
};

export default Home;

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomeProps>> {
  const { req, res } = context;

  const cookie = Nookies.get({ req });

  if (cookie.token) {
    try {
      // Redirect to dashboard if logged in
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    } catch (error) {
      // Handle JWT verification errors here.
      console.error("Error verifying JWT token:", error);
    }
  }

  // Redirect to login if not logged in
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}

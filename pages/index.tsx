import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div>
      <a
        href="/api/google"
        className="p-2 bg-blue-500 text-white rounded cursor-pointer"
      >
        Gogin with Google
      </a>
    </div>
  );
};

export default Home;

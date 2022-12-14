import React, { useEffect, useState } from "react";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import axios from "axios";
import io from "socket.io-client";
import {
  Project,
  getProjects,
  createProject,
} from "../../utils/apicalls/project";
import ProjectComponent from "../../components/Project/Project";
import Nookies from "nookies";
import * as jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";
import DashbordSideBar from "../../components/Dashboard/Sidebar";
import TopBar from "../../components/Dashboard/TopBar";
import MainContent from "../../components/Dashboard/MainContent";
import { ProjectState } from "../../Context/ProjectContext";

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

let socket: any;

const Dashboard = ({ loggedInUserDetails }: any) => {
  const { setLoggedInUser } = ProjectState();
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<string>("Dashboard");
  const router = useRouter();

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();

    setLoggedInUser(loggedInUserDetails);
  };

  useEffect(() => {
    socketInit();
  }, []);

  return (
    <div className="flex h-screen">
      <DashbordSideBar
        openSidebar={openSideBar}
        setShowContent={setShowContent}
      />
      <div className="bg-[#edf3f8] bg-opacity-50 flex-grow">
        <TopBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
        <MainContent componentName={showContent} />
      </div>
    </div>
  );
};

export default Dashboard;

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
  }

  const jwtToken: any = jwt.verify(cookie.token, secret);

  const response = await prisma.user.findUnique({
    where: { id: jwtToken.userId },
  });

  const user: any = JSON.stringify(response);

  return {
    props: {
      loggedInUserDetails: JSON.parse(user),
    },
  };
}

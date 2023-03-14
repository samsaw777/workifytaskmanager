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

const Dashboard = ({ loggedInUserDetails, notificationArray }: any) => {
  const { setLoggedInUser, loggedInUser, notifications, setNotifications } =
    ProjectState();
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<string>("Projects");
  const router = useRouter();

  console.log(notifications);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();

    setLoggedInUser(loggedInUserDetails);

    socket.emit("setup", loggedInUserDetails);

    socket.on("getNotification", (notification: any) => {
      setNotifications((current: any) => [
        ...current,
        notification.notificationData,
      ]);
    });
  };

  useEffect(() => {
    setNotifications(notificationArray);

    socketInit();
  }, []);

  // const currentDate = new Date().toISOString().split("T")[0];
  // const oneWeekLater = new Date();
  // oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  // console.log(oneWeekLater.toISOString().split("T")[0]);

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

  const notifications = await prisma.notifications.findMany({
    where: {
      userId: response?.id,
    },
  });

  const user: any = JSON.stringify(response);

  return {
    props: {
      loggedInUserDetails: JSON.parse(user),
      notificationArray: notifications,
    },
  };
}

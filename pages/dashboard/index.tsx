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

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

interface Message {
  message: string;
}

interface LoggedInUser {
  id: string;
  username: string;
  profile: string;
  email: string;
}

let socket: any;

const Dashboard = ({ loggedInUser }: any) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<string>("Dashboard");
  const router = useRouter();

  // const [projects, setProjects] = useState<Project[]>([]);

  // const [messages, setMessages] = useState<Message[]>([]);
  // const [message, setMessage] = useState<string>("");

  // const socketInitializer = async () => {
  //   // We just call it because we don't need anything else out of it
  //   await fetch("/api/socket");

  //   socket = io();

  //   socket.on("newIncomingMessage", (message: any) => {
  //     console.log(message);
  //     setMessages((currentmsg: any) => [...currentmsg, { message }]);
  //   });

  //   console.log(messages);
  //   getProjects(setProjects);
  // };

  // useEffect(() => {
  //   socketInitializer();
  // }, []);

  // const sendMessaage = async (e: any) => {
  //   e.preventDefault();
  //   socket.emit("createdMessage", message);
  //   setMessages((currentmsg: any) => [...currentmsg, { message }]);
  //   setMessage("");
  // };

  // const body = {
  //   name: "Third Project",
  //   userId: "83fbe910-0dbf-47c7-a101-d827d280b6ba",
  //   isPrivate: true,
  // };

  return (
    <div className="flex h-screen">
      <DashbordSideBar
        openSidebar={openSideBar}
        setShowContent={setShowContent}
      />
      <div className="bg-gray-200 bg-opacity-50 flex-grow">
        <TopBar
          openSideBar={openSideBar}
          setOpenSideBar={setOpenSideBar}
          loggedInUser={{
            email: loggedInUser?.email,
            username: loggedInUser?.username,
            id: loggedInUser?.id,
          }}
        />
        <MainContent
          loggedInUser={{
            email: loggedInUser?.email,
            username: loggedInUser?.username,
            id: loggedInUser?.id,
          }}
          componentName={showContent}
        />
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
      loggedInUser: JSON.parse(user),
    },
  };
}

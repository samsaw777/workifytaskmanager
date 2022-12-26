import React, { useState, useEffect } from "react";
import Nookies from "nookies";
import ProjectSidebar from "../../components/Project/ProjectSisebar";
import TopBar from "../../components/Dashboard/TopBar";
import * as jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import Members from "../../components/Project/addMembers";
import { ProjectContents } from "../../utils/Helper/ProjectContents";
import io from "socket.io-client";
import { ProjectState } from "../../Context/ProjectContext";
import { urlFetcher } from "../../utils/Helper/urlFetcher";

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

let socket: any;

interface User {
  id: string;
  email: string;
  username: string;
  profile: string;
  password: string;
}

const ProjectDetails = ({
  loggedInUser,
  projectId,
  projectTitle,
  project,
}: any) => {
  const { setMembers, setLoggedInUser, setProject, setSprints } =
    ProjectState();
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<string>("view");

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();

    socket.emit("joinproject", { id: projectId });
    socket.on("members", (memberDetails: any) => {
      if (
        memberDetails.project.projectId === projectId &&
        memberDetails.section == "members" &&
        memberDetails.type == "addmember"
      ) {
        setMembers((current: any) => [
          ...current,
          memberDetails.newMemberDetails,
        ]);
      } else if (
        memberDetails.project.projectId === projectId &&
        memberDetails.section == "members" &&
        memberDetails.type == "removemember"
      ) {
        setMembers((current: any) =>
          current.filter(
            (member: any) => member.id != memberDetails.newMemberDetails.id
          )
        );
      } else if (
        memberDetails.project.projectId === projectId &&
        memberDetails.section == "members" &&
        memberDetails.type == "makeadmin"
      ) {
        const newMembers = JSON.parse(
          JSON.stringify(memberDetails.project.members)
        );
        newMembers[memberDetails.index].role = "ADMIN";
        setMembers(newMembers);
      } else if (
        memberDetails.project.projectId === projectId &&
        memberDetails.section == "members" &&
        memberDetails.type == "makemember"
      ) {
        const newMembers = JSON.parse(
          JSON.stringify(memberDetails.project.members)
        );
        newMembers[memberDetails.index].role = "MEMBER";
        setMembers(newMembers);
      }
    });
  };

  useEffect(() => {
    setLoggedInUser(loggedInUser);
    socketInit();
    setProject(project);
    setSprints(project.board[0].sprints);
  }, []);

  useEffect(() => {});
  return (
    <div className="flex h-screen">
      <ProjectSidebar
        openSidebar={openSideBar}
        setShowContent={setShowContent}
        projectTitle={projectTitle}
        // showContent={showContent}
      />
      <div className="bg-gray-200 bg-opacity-5 flex-grow">
        <TopBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
        {/* <ProjectMembers members={projectsDetail?.members} /> */}
        {/* hello */}
        <div className="h-[90vh] p-2">
          {ProjectContents({
            componentName: showContent,
            projectId: projectId,
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const projectId = parseInt(id);
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

  const projectResponse = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      board: {
        include: {
          sprints: {
            orderBy: {
              id: "asc",
            },
            include: {
              issues: {
                orderBy: {
                  id: "asc",
                },
              },
            },
          },
          sections: {
            include: {
              issues: true,
            },
          },
        },
      },
    },
  });

  const project: any = JSON.parse(JSON.stringify(projectResponse));

  const user: any = JSON.stringify(response);

  return {
    props: {
      loggedInUser: JSON.parse(user),
      projectId,
      projectTitle: project.name,
      project,
    },
  };
}

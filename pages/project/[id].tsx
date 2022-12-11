import React, { useState } from "react";
import Nookies from "nookies";
import ProjectSidebar from "../../components/Project/ProjectSisebar";
import TopBar from "../../components/Dashboard/TopBar";
import * as jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import Members from "../../components/Project/addMembers";

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

interface User {
  id: string;
  email: string;
  username: string;
  profile: string;
  password: string;
}

const ProjectDetails = ({ loggedInUser, projectId }: any) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<string>("Board");

  return (
    <div className="flex h-screen">
      <ProjectSidebar
        openSidebar={openSideBar}
        setShowContent={setShowContent}
        // projectTitle={projectsDetail?.name}
        // showContent={showContent}
      />
      <div className="bg-gray-200 bg-opacity-5 flex-grow">
        <TopBar
          openSideBar={openSideBar}
          setOpenSideBar={setOpenSideBar}
          loggedInUser={loggedInUser}
        />
        {/* <ProjectMembers members={projectsDetail?.members} /> */}
        {/* hello */}
        <div className="h-[90vh] p-2">
          <Members
            loggedInUser={{
              id: loggedInUser.id,
              email: loggedInUser.email,
              profileImage: loggedInUser.profile,
            }}
            projectId={projectId}
          />
          {/* {projectContent({
            componentName: showContent,
            board: projectsDetail?.board,
            members: projectsDetail?.members,
            loggedinUserEmail: loggedInUser.email,
          })} */}
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

  const user: any = JSON.stringify(response);

  return {
    props: {
      loggedInUser: JSON.parse(user),
      projectId,
    },
  };
}

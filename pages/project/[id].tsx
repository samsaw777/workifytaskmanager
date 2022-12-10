import React, { useState } from "react";
import Nookies from "nookies";
import ProjectSidebar from "../../components/Project/ProjectSisebar";
import TopBar from "../../components/Dashboard/TopBar";
import * as jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import UserAvatar from "../../components/userAvatar/userSearch";

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

const ProjectDetails = ({ loggedInUser }: any) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<string>("Board");
  const [search, setSearch] = useState<string>("");
  const [searchedUser, setSearchUser] = useState<User[]>([]);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (search == "") {
      console.log("Please search a user");
      return;
    }

    try {
      const { data } = await axios.get(
        `${urlFetcher()}/api/user/searchusers?search=${search}`
      );
      setSearchUser(data);
    } catch (error: any) {
      console.log(error);
    }
  };

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
          hello
          <form onSubmit={(e) => handleSearch(e)}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="w-[90%] p-2 border-2 border-blue-300"
              placeholder="Enter Name To Search User"
            />
            <button className="hidden" type="submit"></button>
          </form>
          <div className="grid grid-cols-2 gap-4 mt-5 mx-5">
            {searchedUser.map((user: User, index: number) => (
              <UserAvatar
                index={index}
                user={{
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  profile: user.profile,
                }}
              />
            ))}
          </div>
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
    },
  };
}

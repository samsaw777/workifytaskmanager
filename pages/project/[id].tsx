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

let socket: any;

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

const ProjectDetails = ({
  loggedInUser,
  projectId,
  projectTitle,
  project,
}: any) => {
  const { setMembers, setLoggedInUser, setProject, setSprints, sprints } =
    ProjectState();
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<string>("view");

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
    socket.emit("joinproject", { id: projectId });

    socket.off("issues");
    socket
      .off("issues")
      .on(
        "issues",
        ({ sprintId, issue, ProjectId, section, type, sprints }: any) => {
          console.log("called");
          if (
            projectId === ProjectId &&
            section == "backlog" &&
            type == "addissue"
          ) {
            let newSprintArray = JSON.parse(JSON.stringify(sprints));
            const sprintIndex = newSprintArray.findIndex(
              (sprint: any) => sprint.id == sprintId
            );
            newSprintArray[sprintIndex].issues.push(issue);
            setSprints(newSprintArray);
          } else if (
            projectId === ProjectId &&
            section == "backlog" &&
            type == "updateissue"
          ) {
            let newSprintArray = JSON.parse(JSON.stringify(sprints));
            const sprintIndex = newSprintArray.findIndex(
              (sprint: any) => sprint.id === sprintId
            );

            const issueIndex = newSprintArray[sprintIndex].issues.findIndex(
              (i: any) => i.id == issue.id
            );

            newSprintArray[sprintIndex].issues[issueIndex].issue = issue.issue;
            newSprintArray[sprintIndex].issues[issueIndex].type = issue.type;
            setSprints(newSprintArray);
          } else if (
            projectId === ProjectId &&
            section == "backlog" &&
            type == "deleteissue"
          ) {
            const sprintIndex: number = sprints.findIndex(
              (sprint: any) => sprint.id === sprintId
            );

            const sprint = JSON.parse(JSON.stringify(sprints));

            sprint[sprintIndex].issues = [
              ...sprint[sprintIndex].issues.filter(
                (i: any) => i.id !== issue.id
              ),
            ];

            setSprints(sprint);
          }
        }
      );

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

    socket
      .off("sprints")
      .on("sprints", ({ ProjectId, sprint, type, section }: any) => {
        if (
          ProjectId === projectId &&
          section === "backlog" &&
          type === "addsprint"
        ) {
          const newSPrint = { ...sprint };
          newSPrint.issues = [];
          setSprints((current: any) => [newSPrint, ...current]);
        } else if (
          ProjectId === projectId &&
          section === "backlog" &&
          type === "deletesprint"
        ) {
          setSprints(sprints.filter((s: any) => s.id != sprint.id));
        } else if (
          ProjectId === projectId &&
          section === "backlog" &&
          type === "updatesprint"
        ) {
          const sprintIndex = sprints.findIndex(
            (Sprint: any) => Sprint.id !== sprint.id
          );

          sprints[sprintIndex].sprintName = sprint.sprintName;
          setSprints([...sprints]);
        }
      });

    socket.on(
      "draggedInSprint",
      ({ ProjectId, type, section, sprint }: any) => {
        if (
          ProjectId === projectId &&
          type == "issuedrag" &&
          section == "backlog"
        ) {
          setSprints([...sprint]);
        }
      }
    );
  };

  useEffect(() => {
    setLoggedInUser(loggedInUser);

    setProject(project);
    socketInit();

    return () => {
      // socket.off("members");
      socket.off("issues");
      socket.off("sprints");
      socket.off("draggedInSprint");
    };
  }, []);

  // useEffect(() => {});
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
      members: true,
      board: {
        include: {
          sprints: {
            orderBy: {
              id: "desc",
            },
            include: {
              issues: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
          sections: {
            include: {
              issues: {
                where: {
                  isUnderStartSprint: false,
                  NOT: {
                    sprintName: "BACKLOG",
                  },
                },
                orderBy: {
                  position: "asc",
                },
              },
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

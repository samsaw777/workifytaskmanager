import React, { useState, useEffect } from "react";
import Nookies from "nookies";
import ProjectSidebar from "../../components/Project/ProjectSisebar";
import TopBar from "../../components/Dashboard/TopBar";
import * as jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import Members from "../../components/Project/addMembers";
import { ProjectContents } from "../../utils/Helper/ProjectContents";
import { io, Socket } from "socket.io-client";
import { ProjectState } from "../../Context/ProjectContext";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import axios from "axios";

export let socket: Socket;

const secret = process.env.JWT_SECRET || "workify";
if (!secret) {
  throw new Error("No Secret");
}

interface Comment {
  id: number;
  userProfile: string;
  comment: string;
  taskId: string;
  username: string;
}

const ProjectDetails = ({
  loggedInUser,
  projectId,
  projectTitle,
  project,
}: any) => {
  const {
    setMembers,
    setLoggedInUser,
    setProject,
    setSprints,
    sprints,
    setSections,
    sections,
    scrumSections,
    setScrumSections,
    setComments,
    localSprints,
    setLocalSprints,
    localSections,
    setLocalSections,
    setLocalScrumSections,
    localScrumSections,
  } = ProjectState();

  // console.log(sprints);

  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<string>("view");

  const fetchMembers = async () => {
    await axios
      .post(`${urlFetcher()}/api/project/getmembers`, {
        projectId,
      })
      .then(({ data }) => {
        setMembers(data);
      });
  };

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
          if (
            projectId === ProjectId &&
            section == "backlog" &&
            type == "addissue"
          ) {
            let newSprintArray = JSON.parse(JSON.stringify(sprints));
            const sprintIndex = newSprintArray.findIndex(
              (sprint: any) => sprint.id == sprintId
            );
            newSprintArray[sprintIndex]?.issues?.push(issue);
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

            const issueIndex = newSprintArray[sprintIndex]?.issues?.findIndex(
              (i: any) => i.id == issue.id
            );

            newSprintArray[sprintIndex].issues[issueIndex].title = issue.title;
            newSprintArray[sprintIndex].issues[issueIndex].type = issue.type;
            newSprintArray[sprintIndex].issues[issueIndex].description =
              issue.description;
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

            (sprint[sprintIndex].issues = sprint[sprintIndex].issues.filter(
              (i: any) => i.id !== issue.id
            )),
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
      .on("sprints", ({ ProjectId, sprint, type, section, sprints }: any) => {
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
          const localSrpints = JSON.parse(JSON.stringify(sprints));

          setSprints(localSrpints.filter((s: any) => s.id != sprint.id));
        } else if (
          ProjectId === projectId &&
          section === "backlog" &&
          type === "updatesprint"
        ) {
          const localSrpints = JSON.parse(JSON.stringify(sprints));
          const sprintIndex = localSrpints.findIndex(
            (Sprint: any) => Sprint.id === sprint.id
          );
          localSrpints[sprintIndex].sprintName = sprint.sprintName;
          localSrpints[sprintIndex].startDate = sprint.startDate;
          localSrpints[sprintIndex].endDate = sprint.endDate;
          setSprints([...localSrpints]);
        } else if (
          ProjectId === projectId &&
          section === "backlog" &&
          type === "startSprint"
        ) {
          const localSrpints = JSON.parse(JSON.stringify(sprints));
          const sprintIndex = localSrpints.findIndex(
            (Sprint: any) => Sprint.id === sprint.id
          );
          localSrpints[sprintIndex].isUnderStartSprint =
            sprint.isUnderStartSprint;
          setSprints([...localSrpints]);
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
        } else if (
          ProjectId === projectId &&
          type === "dragged" &&
          section === "scrumboard"
        ) {
          setScrumSections([...sprint]);
        } else if (
          ProjectId === projectId &&
          type == "taskDraged" &&
          section == "kanban"
        ) {
          setSections([...sprint]);
        }
      }
    );

    socket.on(
      "sectionCreation",
      ({
        ProjectId,
        type,
        kanbansection,
        dashboardsection,
        kanbansections,
      }: any) => {
        if (
          ProjectId === projectId &&
          type === "createsection" &&
          dashboardsection === "kanban"
        ) {
          setSections((section) => [...section, kanbansection]);
        } else if (
          ProjectId === projectId &&
          type === "deletesection" &&
          dashboardsection === "kanban"
        ) {
          setSections((section) =>
            section.filter((s) => s.id !== kanbansection.id)
          );
        } else if (
          ProjectId == projectId &&
          type === "updatesection" &&
          dashboardsection === "kanban"
        ) {
          const sectionIndex = kanbansections.findIndex(
            (s: any) => s.id === kanbansection.id
          );

          kanbansections[sectionIndex].title = kanbansection.title;
          setSections([...kanbansections]);
        } else if (
          ProjectId == projectId &&
          type === "updatesection" &&
          dashboardsection === "scrum"
        ) {
          const sectionIndex = kanbansections.findIndex(
            (s: any) => s.id === kanbansection.id
          );

          kanbansections[sectionIndex].title = kanbansection.title;
          setScrumSections([...kanbansections]);
        } else if (
          ProjectId === projectId &&
          type === "deletesection" &&
          dashboardsection === "scrum"
        ) {
          setScrumSections((current) =>
            current.filter((section: any) => section.id !== kanbansection.id)
          );
        }
      }
    );

    socket.on(
      "tasks",
      ({ ProjectId, task, type, section, sections, localSprints }: any) => {
        if (
          ProjectId === projectId &&
          type == "createtask" &&
          section == "kanban"
        ) {
          let newSections = JSON.parse(JSON.stringify(sections));
          console.log(newSections);
          const sectionIndex = sections.findIndex(
            (section: any) => section.id === task.sectionId
          );
          console.log(sectionIndex);
          newSections[sectionIndex].tasks =
            newSections[sectionIndex]?.tasks?.length > 0
              ? newSections[sectionIndex].tasks
              : [];
          newSections[sectionIndex]?.tasks?.push(task);
          console.log(newSections[sectionIndex]);
          setSections(newSections);
        } else if (
          ProjectId === projectId &&
          type == "deletetask" &&
          section == "kanban"
        ) {
          const newData = JSON.parse(JSON.stringify(sections));
          const sectionIndex = newData.findIndex(
            (e: any) => e.id == task?.sectionId
          );
          const taskIndex = newData[sectionIndex].tasks.findIndex(
            (e: any) => e.id == task.id
          );
          newData[sectionIndex].tasks.splice(taskIndex, 1);
          setSections(newData);
        } else if (
          ProjectId === projectId &&
          type == "updatetask" &&
          section == "kanban"
        ) {
          let sectionIndex = sections.findIndex(
            (section: any) => section.id == task?.sectionId
          );

          const index = sections[sectionIndex].tasks.findIndex(
            (e: any) => e.id === task?.id
          );
          sections[sectionIndex].tasks[index].title = task?.title;
          setSections(sections);
        } else if (
          ProjectId === projectId &&
          type == "updatedescription" &&
          section == "kanban"
        ) {
          let sectionIndex = sections.findIndex(
            (section: any) => section.id == task?.sectionId
          );

          const index = sections[sectionIndex].tasks.findIndex(
            (e: any) => e.id === task?.id
          );
          sections[sectionIndex].tasks[index].description = task?.description;
          setSections(sections);
        } else if (
          projectId === ProjectId &&
          section === "sprint" &&
          type === "updatetask"
        ) {
          const newSprints = JSON.parse(JSON.stringify(sections));
          const sprintIndex = sections.findIndex(
            (sprint: any) => sprint.id === task.sprintId
          );
          const issueIndex = newSprints[sprintIndex].issues.findIndex(
            (i: any) => i.id === task.id
          );

          newSprints[sprintIndex].issues[issueIndex].title = task.title;
          setSprints(newSprints);
        } else if (
          projectId === ProjectId &&
          section === "sprint" &&
          type === "updatedescription"
        ) {
          const newSprints = JSON.parse(JSON.stringify(sections));
          const sprintIndex = sections.findIndex(
            (sprint: any) => sprint.id === task.sprintId
          );
          const issueIndex = newSprints[sprintIndex].issues.findIndex(
            (i: any) => i.id === task.id
          );

          newSprints[sprintIndex].issues[issueIndex].description =
            task.description;
          setSprints(newSprints);
        } else if (
          projectId === ProjectId &&
          section === "scrumSection" &&
          type === "updatetask"
        ) {
          const newScrumSections = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (section: any) => section.id === task.sectionId
          );
          const issueIndex = newScrumSections[sectionIndex].issues.findIndex(
            (i: any) => i.id === task.id
          );

          newScrumSections[sectionIndex].issues[issueIndex].title = task.title;
          setScrumSections(newScrumSections);
        } else if (
          projectId === ProjectId &&
          section === "scrumSection" &&
          type === "updatedescription"
        ) {
          const newScrumSections = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (section: any) => section.id === task.sectionId
          );
          const issueIndex = newScrumSections[sectionIndex].issues.findIndex(
            (i: any) => i.id === task.id
          );

          newScrumSections[sectionIndex].issues[issueIndex].description =
            task.description;
          setScrumSections(newScrumSections);
        } else if (
          projectId === ProjectId &&
          section === "scrumSection" &&
          type === "updateAssignTo"
        ) {
          console.log(sections);
          const newScrumSections = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (section: any) => section.id === task.sectionId
          );
          const issueIndex = newScrumSections[sectionIndex].issues.findIndex(
            (i: any) => i.id === task.id
          );

          const newLocalScrumSections = JSON.parse(
            JSON.stringify(localSprints)
          );
          const localSprintIndex = localSprints.findIndex(
            (sprint: any) => sprint.id === task.sectionId
          );
          const localIssueIndex = newLocalScrumSections[
            localSprintIndex
          ].issues.findIndex((i: any) => i.id === task.id);

          newScrumSections[sectionIndex].issues[issueIndex].assignedUser =
            task.memberInfo;
          newScrumSections[sectionIndex].issues[issueIndex].assignedTo =
            task.userId;

          newLocalScrumSections[localSprintIndex].issues[
            localIssueIndex
          ].assignedUser = task.memberInfo;
          newLocalScrumSections[localSprintIndex].issues[
            localIssueIndex
          ].assignedTo = task.userId;

          setScrumSections(newScrumSections);
          setLocalScrumSections([...newLocalScrumSections]);
        } else if (
          projectId === ProjectId &&
          section === "sprint" &&
          type === "updateAssignTo"
        ) {
          const newScrumSections = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (section: any) => section.id === task.sprintId
          );
          const issueIndex = newScrumSections[sectionIndex].issues.findIndex(
            (i: any) => i.id === task.id
          );

          const newLocalScrumSections = JSON.parse(
            JSON.stringify(localSprints)
          );
          const localSprintIndex = localSprints.findIndex(
            (sprint: any) => sprint.id === task.sprintId
          );
          const localIssueIndex = newLocalScrumSections[
            localSprintIndex
          ].issues.findIndex((i: any) => i.id === task.id);

          newScrumSections[sectionIndex].issues[issueIndex].assignedUser =
            task.memberInfo;
          newScrumSections[sectionIndex].issues[issueIndex].assignedTo =
            task.userId;

          newLocalScrumSections[localSprintIndex].issues[
            localIssueIndex
          ].assignedUser = task.memberInfo;
          newLocalScrumSections[localSprintIndex].issues[
            localIssueIndex
          ].assignedTo = task.userId;

          setSprints([...newScrumSections]);
          setLocalSprints([...newLocalScrumSections]);
        } else if (
          projectId === ProjectId &&
          section === "kanban" &&
          type === "updateAssignTo"
        ) {
          const newScrumSections = JSON.parse(JSON.stringify(sections));
          const sectionIndex: number = sections.findIndex(
            (section: any) => section.id === task.sectionId
          );
          const issueIndex = newScrumSections[sectionIndex].tasks.findIndex(
            (i: any) => i.id === task.id
          );

          const newLocalScrumSections = JSON.parse(
            JSON.stringify(localSprints)
          );
          const localSprintIndex = localSprints.findIndex(
            (sprint: any) => sprint.id === task.sectionId
          );
          const localIssueIndex = newLocalScrumSections[
            localSprintIndex
          ].tasks.findIndex((i: any) => i.id === task.id);

          newScrumSections[sectionIndex].tasks[issueIndex].assignedUser =
            task.memberInfo;
          newScrumSections[sectionIndex].tasks[issueIndex].assignedTo =
            task.userId;

          newLocalScrumSections[localSprintIndex].tasks[
            localIssueIndex
          ].assignedUser = task.memberInfo;
          newLocalScrumSections[localSprintIndex].tasks[
            localIssueIndex
          ].assignedTo = task.userId;

          setSections([...newScrumSections]);
          setLocalSections([...newLocalScrumSections]);
        }
      }
    );

    socket.on(
      "commentCreation",
      ({
        ProjectId,
        comment,
        type,
        section,
        comments,
      }: {
        ProjectId: number;
        members: {}[];
        comment: Comment;
        type: string;
        section: string;
        comments: Comment[];
      }) => {
        if (
          ProjectId === projectId &&
          type === "createComment" &&
          section === "kanban"
        ) {
          setComments([comment, ...comments]);
        } else if (
          ProjectId == projectId &&
          type == "deleteComment" &&
          section === "kanban"
        ) {
          const allData = JSON.parse(JSON.stringify(comments));

          const commentIndex = allData?.findIndex(
            (c: any) => c.id === comment?.id
          );

          allData.splice(commentIndex, 1);

          setComments(allData);
        } else if (
          ProjectId == projectId &&
          type === "updateComment" &&
          section === "kanban"
        ) {
          const index = comments.findIndex((c: any) => c.id === comment.id);

          comments[index].comment = comment.comment;

          setComments(comments);
        }
      }
    );

    socket.on(
      "labelCreation",
      ({ ProjectId, label, task, type, section, sections }: any) => {
        if (
          ProjectId === projectId &&
          type === "createTask" &&
          section === "kanban"
        ) {
          const newSectionObject = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (s: any) => s.id === task?.sectionId
          );
          const taskIndex = newSectionObject[sectionIndex]?.tasks?.findIndex(
            (t: any) => t.id === task?.id
          );
          newSectionObject[sectionIndex].tasks[taskIndex].labels =
            newSectionObject[sectionIndex]?.tasks[taskIndex]?.labels?.length > 0
              ? newSectionObject[sectionIndex].tasks[taskIndex].labels
              : [];

          newSectionObject[sectionIndex].tasks[taskIndex].labels.push(label);

          setSections(newSectionObject);
        } else if (
          ProjectId === projectId &&
          type === "createTask" &&
          section === "scrum"
        ) {
          const newSectionObject = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (s: any) => s.id === task?.sectionId
          );
          const taskIndex = newSectionObject[sectionIndex]?.issues?.findIndex(
            (t: any) => t.id === task?.id
          );
          newSectionObject[sectionIndex].issues[taskIndex].labels =
            newSectionObject[sectionIndex]?.issues[taskIndex]?.labels?.length >
            0
              ? newSectionObject[sectionIndex].issues[taskIndex].labels
              : [];

          newSectionObject[sectionIndex].issues[taskIndex].labels.push(label);

          setSprints(newSectionObject);
        } else if (
          ProjectId === projectId &&
          type === "createTask" &&
          section === "scrumSection"
        ) {
          const newSectionObject = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (s: any) => s.id === task?.sectionId
          );
          const taskIndex = newSectionObject[sectionIndex]?.issues?.findIndex(
            (t: any) => t.id === task?.id
          );
          newSectionObject[sectionIndex].issues[taskIndex].labels =
            newSectionObject[sectionIndex]?.issues[taskIndex]?.labels?.length >
            0
              ? newSectionObject[sectionIndex].issues[taskIndex].labels
              : [];

          newSectionObject[sectionIndex].issues[taskIndex].labels.push(label);

          setScrumSections(newSectionObject);
        } else if (
          ProjectId === projectId &&
          type === "deleteTask" &&
          section === "kanban"
        ) {
          const labelIndex = task.labels.findIndex(
            (l: any) => l.id === label.id
          );
          const newSectionObject = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (s: any) => s.id === task.sectionId
          );
          const taskIndex = newSectionObject[sectionIndex].tasks.findIndex(
            (t: any) => t.id === task.id
          );
          newSectionObject[sectionIndex].tasks[taskIndex].labels.splice(
            labelIndex,
            1
          );

          setSections(newSectionObject);
        } else if (
          ProjectId === projectId &&
          type === "deleteTask" &&
          section === "scrum"
        ) {
          const labelIndex = task.labels.findIndex(
            (l: any) => l.id === label.id
          );
          const newSectionObject = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (s: any) => s.id === task.sectionId
          );
          const taskIndex = newSectionObject[sectionIndex].issues.findIndex(
            (t: any) => t.id === task.id
          );
          newSectionObject[sectionIndex].issues[taskIndex].labels.splice(
            labelIndex,
            1
          );

          setSprints(newSectionObject);
        } else if (
          ProjectId === projectId &&
          type === "deleteTask" &&
          section === "scrumSection"
        ) {
          const labelIndex = task.labels.findIndex(
            (l: any) => l.id === label.id
          );
          const newSectionObject = JSON.parse(JSON.stringify(sections));
          const sectionIndex = sections.findIndex(
            (s: any) => s.id === task.sectionId
          );
          const taskIndex = newSectionObject[sectionIndex].issues.findIndex(
            (t: any) => t.id === task.id
          );
          newSectionObject[sectionIndex].issues[taskIndex].labels.splice(
            labelIndex,
            1
          );

          setScrumSections(newSectionObject);
        }
      }
    );
  };

  useEffect(() => {
    setLoggedInUser(loggedInUser);

    setProject(project);
    fetchMembers();
    socketInit();

    return () => {
      // socket.off("members");
      socket.off("issues");
      socket.off("sprints");
      socket.off("draggedInSprint");
      socket.off("sectionCreation");
      socket.off("task");
    };
  }, []);

  // useEffect(() => {});
  return (
    <div className="flex h-screen w-full">
      <div className="">
        <ProjectSidebar
          openSidebar={openSideBar}
          setShowContent={setShowContent}
          projectTitle={project.name}
          // showContent={showContent}
        />
      </div>

      <div className="bg-gray-200 bg-opacity-5 overflow-hidden flex-grow">
        <TopBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
        {/* <ProjectMembers members={projectsDetail?.members} /> */}
        {/* hello */}
        <div className="h-[90vh] p-2 overflow-scroll">
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

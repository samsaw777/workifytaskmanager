import React from "react";

export default (io: any, socket: any) => {
  const dashboardSocket = (user: any) => {
    socket.join(user.id);
    socket.emit("Connected User", user.id);
  };

  //Join the project with socket.
  const joinProject = (project: any) => {
    socket.join(project.id);

    console.log("User Joined", project.id);
    socket.emit("Connected Room", project.id);
  };

  const createdMessage = (msg: any) => {
    socket.broadcast.emit("newIncomingMessage", msg);
  };

  socket.on("createdMessage", createdMessage);

  socket.on("setup", dashboardSocket);

  socket.on("joinproject", (project: any) => {
    socket.join(project.id);
  });

  //notifications socket
  socket.on("notifications", (notification: any) => {
    socket.to(notification.userId).emit("getNotification", notification);
  });

  //send membes joined to other users.
  /* 
    Member Object will have = senderId, membersList, newMemberDetails, projectId, type 
  */
  socket.on("memberadded", (memberDetails: any) => {
    let project = memberDetails.project;

    if (!project.members) return console.log("Members not Found!");

    socket.to(project.projectId).emit("members", memberDetails);
  });

  //Creating socket to send the issues created in backlog and sprints.
  //IssueDetails -> members, projectId, sprints, sprintId, issuesDetails
  socket.on(
    "issueCreated",
    (issueDetails: {
      projectId: number;
      members: any;
      sprintId: number;
      issue: any;
      section: string;
      type: string;
      sprints: any;
    }) => {
      const { projectId, members, sprintId, issue, section, type, sprints } =
        issueDetails;

      if (!members) return console.log("Members not found!");

      socket.to(projectId).emit("issues", {
        sprintId,
        issue,
        ProjectId: projectId,
        section,
        type,
        sprints,
      });
    }
  );

  //Creating, Updating, Deleting sprints in backlogs and sprints.
  //SprintDetails -> projectId, members, sprint, type, section
  socket.on(
    "sprintCreated",
    (sprintDetails: {
      ProjectId: number;
      members: any;
      sprint: any;
      type: string;
      section: string;
      sprints: any;
    }) => {
      const { members, ProjectId, sprint, type, section, sprints } =
        sprintDetails;

      if (!members) return console.log("Members not found!");

      socket.to(ProjectId).emit("sprints", {
        ProjectId,
        sprint,
        type,
        section,
        sprints,
      });
    }
  );

  socket.on(
    "issueDraggedInSprint",
    ({ ProjectId, members, type, section, sprint }: any) => {
      if (!members) return console.log("Members not found!");

      socket.to(ProjectId).emit("draggedInSprint", {
        ProjectId,
        type,
        section,
        sprint,
      });
    }
  );

  socket.on(
    "sectionCreated",
    ({
      ProjectId,
      members,
      kanbansection,
      type,
      dashboardsection,
      sections,
    }: any) => {
      if (!members) return console.log("Members not found!");

      socket.to(ProjectId).emit("sectionCreation", {
        ProjectId,
        kanbansection,
        type,
        dashboardsection,
        kanbansections: sections,
      });
    }
  );

  //Socket to creaate task.
  socket.on(
    "taskCreated",
    ({
      ProjectId,
      members,
      task,
      type,
      section,
      sections,
      localSprints,
    }: any) => {
      if (!members) return console.log("Members not found!");

      socket.to(ProjectId).emit("tasks", {
        ProjectId,
        task,
        type,
        section,
        sections,
        localSprints,
      });
    }
  );

  socket.on(
    "commentCreated",
    ({
      ProjectId,
      members,
      comment,
      type,
      section,
      comments,
    }: {
      ProjectId: number;
      members: {}[];
      comment: {
        id: number;
        userProfile: string;
        comment: string;
        taskId: string;
        username: string;
      };
      type: string;
      section: string;
      comments: {}[];
    }) => {
      if (!members) return console.log("Members not found!");

      socket.to(ProjectId).emit("commentCreation", {
        ProjectId,
        comment,
        type,
        section,
        comments,
      });
    }
  );

  socket.on(
    "labelCreated",
    ({
      ProjectId,
      members,
      label,
      task,
      type,
      section,
      sections,
    }: {
      ProjectId: number;
      members: any;
      label: any;
      task: any;
      type: string;
      section: string;
      sections: {}[];
    }) => {
      if (!members) return console.log("Members not found!");

      socket.to(ProjectId).emit("labelCreation", {
        ProjectId,
        label,
        task,
        type,
        section,
        sections,
      });
    }
  );
};

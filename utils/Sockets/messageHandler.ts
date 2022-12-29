export default (io: any, socket: any) => {
  const dashboardSocket = (user: any) => {
    socket.join(user.id);
    socket.emit("Connected User", user.id);
  };

  //Join the project with socket.
  const joinProject = (project: any) => {
    socket.join(project.id);
    console.log(project.id);
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
};

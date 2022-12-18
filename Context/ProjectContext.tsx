import React, { createContext, useContext, useState } from "react";

interface loggedInUser {
  id: string;
  username: string;
  email: string;
  profile: string;
  password: string;
}

interface Member {
  id: number;
  email: string;
  userId: string;
  profileImage: string;
  role: string;
  projectId: number;
}

interface ScrumIssue {
  id: number;
  type: string;
  issue: string;
  projectId: number;
  username: string;
  profile: string;
  userId: string;
  sectionId: number;
  sectionName: string;
}

interface Context {
  loggedInUser: loggedInUser;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setLoggedInUser: React.Dispatch<React.SetStateAction<loggedInUser>>;
  project: any;
  setProject: any;
  issues: ScrumIssue[];
  setIssues: React.Dispatch<React.SetStateAction<ScrumIssue[]>>;
}

const ProjectContext = createContext<Context>({
  loggedInUser: {
    id: "",
    username: "",
    email: "",
    profile: "",
    password: "",
  },
  setLoggedInUser() {},
  members: [],
  setMembers: () => [],
  project: {},
  setProject: () => {},
  setIssues: () => [],
  issues: [],
});

const ProjectProvider = ({ children }: any) => {
  const [loggedInUser, setLoggedInUser] = useState<loggedInUser>({
    id: "",
    username: "",
    email: "",
    profile: "",
    password: "",
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [project, setProject] = useState<any>({});
  const [issues, setIssues] = useState<ScrumIssue[]>([]);
  return (
    <ProjectContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        members,
        setMembers,
        project,
        setProject,
        issues,
        setIssues,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const ProjectState = () => {
  return useContext(ProjectContext);
};

export default ProjectProvider;

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

interface Context {
  loggedInUser: loggedInUser;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setLoggedInUser: React.Dispatch<React.SetStateAction<loggedInUser>>;
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
  return (
    <ProjectContext.Provider
      value={{ loggedInUser, setLoggedInUser, members, setMembers }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const ProjectState = () => {
  return useContext(ProjectContext);
};

export default ProjectProvider;

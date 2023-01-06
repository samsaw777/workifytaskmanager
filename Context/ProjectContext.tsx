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

interface Sprint {
  id: number;
  sprintName: string;
}

interface Section {
  id: number;
  title: string;
  boardId: number;
}

export interface Label {
  id: number;
  name: string;
  taskId: number;
}

interface Task {
  id: number;
  title: string;
  profile: string;
  username: string;
  userId: string;
  description: string;
  positon: number;
  sectionId: number;
  labels: Label[] | [];
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
  sprints: Sprint[];
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  scrumSections: Section[];
  setScrumSections: React.Dispatch<React.SetStateAction<Section[]>>;
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
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
  sprints: [],
  setSprints: () => [],
  sections: [],
  setSections: () => [],
  labels: [],
  setLabels: () => [],
  scrumSections: [],
  setScrumSections: () => [],
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
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [scrumSections, setScrumSections] = useState<Section[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
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
        sprints,
        setSprints,
        sections,
        setSections,
        labels,
        setLabels,
        scrumSections,
        setScrumSections,
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

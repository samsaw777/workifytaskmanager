import React, { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";

interface loggedInUser {
  id: string;
  username: string;
  email: string;
  profile: string;
  password: string;
}

interface Member {
  id: number;
  username: string;
  userId: string;
  profileImage: string;
  role: string;
  projectId: number;
}

interface ScrumIssue {
  id: number;
  type: string;
  title: string;
  description: string;
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
  localSprints: Sprint[];
  setLocalSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  localSections: Section[];
  setLocalSections: React.Dispatch<React.SetStateAction<Section[]>>;
  scrumSections: Section[];
  setScrumSections: React.Dispatch<React.SetStateAction<Section[]>>;
  localScrumSections: Section[];
  setLocalScrumSections: React.Dispatch<React.SetStateAction<Section[]>>;
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  comments: {}[];
  setComments: React.Dispatch<React.SetStateAction<{}[]>>;
  setNotifications: any;
  notifications: any;
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
  localSprints: [],
  setLocalSprints: () => [],
  sections: [],
  setSections: () => [],
  localSections: [],
  setLocalSections: () => [],
  labels: [],
  setLabels: () => [],
  scrumSections: [],
  setScrumSections: () => [],
  localScrumSections: [],
  setLocalScrumSections: () => [],
  setComments: () => [],
  comments: [],
  setNotifications: () => [],
  notifications: [],
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
  const [localSprints, setLocalSprints] = useState<Sprint[]>([]);
  const [localScrumSections, setLocalScrumSections] = useState<Section[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [localSections, setLocalSections] = useState<Section[]>([]);
  const [scrumSections, setScrumSections] = useState<Section[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [comments, setComments] = useState<{}[]>([]);
  const [notifications, setNotifications] = useState<{}[]>([]);

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
        comments,
        setComments,
        notifications,
        setNotifications,
        localSprints,
        setLocalSprints,
        localScrumSections,
        setLocalScrumSections,
        localSections,
        setLocalSections,
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

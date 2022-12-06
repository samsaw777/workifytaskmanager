import React, { useState } from "react";
import {
  Project,
  getProjects,
  createProject,
  updateProject,
} from "../../utils/apicalls/project";

interface LoggedInUser {
  id: string;
}

interface Props {
  loggedinUser: LoggedInUser;
}

const ProjectComponent = ({ loggedinUser }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [projectDetails, setProjectDetails] = useState<any>({});
  const [fetchProjectPointer, setFetchProjectPointer] =
    useState<boolean>(false);
  console.log(loggedinUser);
  return <div>This is the project project.</div>;
};

export default ProjectComponent;

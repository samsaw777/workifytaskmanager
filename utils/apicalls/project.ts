import axios from "axios";
import { urlFetcher } from "../Helper/urlFetcher";

export interface Project {
  id: number;
  name: string;
  isPrivate: boolean;
  isKanban: boolean;
  isScrum: boolean;
  isBug: boolean;
}

interface projectBody {
  name: string;
  isPrivate: boolean;
  userId: string;
}

export const createProject = async (
  projects: Project[],
  projectInformation: projectBody,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  const projectArray = JSON.parse(JSON.stringify(projects));

  await axios
    .post(`${urlFetcher()}/api/project/createproject`, projectInformation)
    .then((response) => {
      projectArray.push(response.data);
      setProjects(projectArray);
    })
    .catch((error: any) => {
      console.log(error.response.data.error);
    });
};

export const getProjects = async (
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  await axios
    .get(`${urlFetcher()}/api/project/getproject`)
    .then((response) => {
      setProjects(response.data);
    })
    .catch((error: any) => {
      console.log(error.response.data.error);
    });
};

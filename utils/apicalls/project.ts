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

interface updateproject {
  name: string;
  isPrivate: boolean;
  id: number;
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
  try {
    await axios
      .get(`${urlFetcher()}/api/project/getproject`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error: any) => {
        console.log(error.response.data.error);
      });
  } catch (error: any) {
    console.log(error);
  }
};

export const updateProject = async (
  project: Project[],
  index: number,
  projectInformation: updateproject,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  try {
    const newProject = JSON.parse(JSON.stringify(project));
    await axios
      .post(`${urlFetcher()}/api/project/updateproject`, projectInformation)
      .then((response) => {
        newProject[index].name = projectInformation.name;
        newProject[index].isPrivate = projectInformation.isPrivate;

        setProjects(newProject);
      })
      .catch((error: any) => {
        console.log(error.response.data.error);
      });
  } catch (error: any) {
    console.log(error);
  }
};

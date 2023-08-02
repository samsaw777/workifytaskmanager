import React, { useState, useEffect } from "react";
import { Project } from "../../utils/apicalls/project";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import Link from "next/link";
import io from "socket.io-client";
import { useRouter } from "next/router";
import { ProjectState } from "../../Context/ProjectContext";
import ProjectLoading from "../Loading/ProjectLoading";
import dynamic from "next/dynamic";
import ProjectUI from "./Project";
let socket: any;

// Importing dynamic components
const ProjectModal = dynamic(() => import("../Modals/ProjectModal"), {
  loading: () => <div>Loading...</div>,
});

const DeleteProjectModal = dynamic(
  () => import("../Modals/DeleteProjectModal"),
  {
    loading: () => <div>Loading...</div>,
  }
);

const ProjectComponent = () => {
  const router = useRouter();
  const {
    loggedInUser: { id, username },
  } = ProjectState();
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [projectDetails, setProjectDetails] = useState<any>({});
  const [index, setIndex] = useState<number>(0);
  const [fetchProjectPointer, setFetchProjectPointer] =
    useState<boolean>(false);

  const getProject = async () => {
    try {
      setLoading(true);
      await axios
        .get(`${urlFetcher()}/api/project/getproject`)
        .then((response) => {
          setProjects(response.data);
          setLoading(false);
        })
        .catch((error: any) => {
          console.log(error.response.data.error);
          setLoading(false);
        });
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();

    getProject();
  };

  //get projects
  useEffect(() => {
    // getProject();
    socketInit();
  }, []);

  useEffect(() => {}, []);

  const updateProjectDetails = (project: any, index: number) => {
    setProjectDetails(project);
    setIndex(index);
    setIsModalOpen(!isModalOpen);
  };

  const deleteProject = (project: any) => {
    setProjectDetails(project);
    setIsDeleteOpen(!isDeleteOpen);
  };

  return (
    <div className="w-full">
      <div className="flex space-x-5 items-center">
        <span>{username}'s Projects</span>
      </div>
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 mt-5">
          {[...Array(3)].map(() => (
            <ProjectLoading />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 mt-5">
        {projects?.map((project: any, index: number) => (
          <div key={index}>
            <ProjectUI
              project={project}
              updateProjectDetails={updateProjectDetails}
              deleteProject={deleteProject}
            />
          </div>
        ))}
        <button
          className="rounded-md p-5 font-bold border-2 border-green-500 border-dashed cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          New Project +
        </button>
      </div>
      <DeleteProjectModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Project"
        name={projectDetails.name}
        projectId={parseInt(projectDetails.id)}
        projects={projects}
        setProjects={setProjects}
      />
      <ProjectModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        userId={id}
        setProjects={setProjects}
        projects={projects}
        setProjectDetails={setProjectDetails}
        projectTitle={projectDetails?.name}
        projectStatus={projectDetails?.isPrivate}
        projectId={parseInt(projectDetails?.id)}
        index={index}
        setIndex={setIndex}
      />
    </div>
  );
};

export default ProjectComponent;

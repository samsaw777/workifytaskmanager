import React, { useState, useEffect } from "react";
import { Project } from "../../utils/apicalls/project";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import Link from "next/link";
import ProjectModal from "../Modals/ProjectModal";
import DeleteProjectModal from "../Modals/DeleteProjectModal";
import io from "socket.io-client";
import { useRouter } from "next/router";
import { ProjectState } from "../../Context/ProjectContext";

let socket: any;

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

  const socketInit = async () => {
    await fetch("/api/socket");

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
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 mt-5">
        {projects?.map((project: any, index: number) => (
          <div
            key={index}
            className="bg-white rounded-md p-5 flex flex-col space-y-10 cursor-pointer border border-gray-200 shadow-md"
          >
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <span className="text-lg font-medium text-gray-800">
                  {project.name}
                </span>
                <span
                  className={`px-4 rounded-md border text-sm ${
                    project.isPrivate
                      ? "border-red-400 bg-red-100 text-red-600"
                      : "border-green-400 bg-green-100 text-green-600"
                  }`}
                >
                  {project.isPrivate ? "Private" : "Public"}
                </span>
              </div>
              <Link href={`/project/${project.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 cursor-pointer p-1 hover:bg-gray-200 rounded hover:text-gray-700 text-[#707070] font-bold"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer p-1 hover:bg-green-200 rounded hover:text-green-700 text-[#707070] font-bold"
                  onClick={() =>
                    updateProjectDetails(
                      {
                        id: project.id,
                        name: project.name,
                        isPrivate: project.isPrivate,
                      },
                      index
                    )
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer p-1 hover:bg-red-200 rounded hover:text-red-700 text-[#707070] font-bold"
                  onClick={() =>
                    deleteProject({
                      id: project.id,
                      name: project.name,
                    })
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            </div>
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

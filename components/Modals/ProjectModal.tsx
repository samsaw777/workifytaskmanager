import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Project,
  createProject,
  updateProject,
} from "../../utils/apicalls/project";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  projectTitle?: string | undefined;
  projectStatus?: boolean | undefined;
  projectId?: number | undefined;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projects: Project[];
  setProjectDetails: React.Dispatch<any>;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}
interface ProjectType {
  projectName: string;
  isPrivate: boolean;
}

const ProjectModal = ({
  isOpen,
  setIsOpen,
  userId,
  projectTitle,
  projectStatus,
  projectId,
  setProjects,
  projects,
  setProjectDetails,
  index,
  setIndex,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<ProjectType>();

  useEffect(() => {
    setValue("projectName", projectTitle ? projectTitle : "");
    setValue("isPrivate", projectStatus ? projectStatus : false);
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(!isOpen);
    clearErrors();
    setValue("projectName", "");
    setValue("isPrivate", false);

    setProjectDetails({});
  };

  const createUserProject = handleSubmit(async (formData: ProjectType) => {
    const notification = toast.loading("Creating Project!");
    if (Object.keys(errors).length == 0) {
      try {
        await createProject(
          projects,
          { name: formData.projectName, userId, isPrivate: formData.isPrivate },
          setProjects
        );
        closeModal();
        toast.success("Project Created!", {
          id: notification,
        });
      } catch (error: any) {
        toast.error(error.message, { id: notification });
      }
    }
  });

  const updateUserProject = handleSubmit(async (formData: ProjectType) => {
    const notification = toast.loading("Updating Project!");
    if (Object.keys(errors).length == 0) {
      try {
        await updateProject(
          projects,
          index,
          {
            id: projectId,
            name: formData.projectName,
            isPrivate: formData.isPrivate,
          },
          setProjects
        );
        closeModal();
        setIndex(0);
        toast.success("Project Updated!", {
          id: notification,
        });
      } catch (error: any) {
        toast.error(error.message, {
          id: notification,
        });
      }
    }
  });

  return (
    <div
      className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center `}
      id="overlay"
      //   onClick={() => setIsOpen(!isOpen)}
    >
      <div className="bg-white w-[550px] h-[400px] py-4 px-4 rounded-md shadow-xl text-gray-800">
        <div className="flex justify-center flex-col-reverse">
          <h4 className="text-lg font-bold text-center flex-grow">
            {projectId ? "Update Project" : "New Project"}
          </h4>
          <svg
            className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-full"
            id="close-modal"
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={closeModal}
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="mt-2">
          <form onSubmit={projectId ? updateUserProject : createUserProject}>
            <div className="flex flex-col space-y-3">
              <label className="font-medium text-md">Project Name</label>
              <input
                className="w-full p-2 border border-gray-400 rounded-md focus:outline-none font-mediun"
                placeholder="Enter Project Name"
                {...register("projectName", {
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
              />
              {errors?.projectName &&
                errors?.projectName?.type === "required" && (
                  <div className="w-full text-red-400 font-bold">
                    Project name Required!
                  </div>
                )}
              {errors?.projectName &&
                errors?.projectName?.type === "minLength" && (
                  <div className="w-full text-red-400 font-bold">
                    Project should be atleast of 3 characters!
                  </div>
                )}
              {errors?.projectName &&
                errors?.projectName?.type === "maxLength" && (
                  <div className="w-full text-red-400 font-bold">
                    Project should be atmost of 25 characters!
                  </div>
                )}
            </div>

            <div className="mt-6 flex flex-col space-y-2">
              <div className="text-md font-bold text-gray- flex justify-between">
                <span className="flex space-x-1 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="mt-1">Make Private</span>
                </span>
                <div>
                  <label
                    htmlFor="default-toggle"
                    className="inline-flex relative items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      {...register("isPrivate")}
                      id="default-toggle"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00FF00]"></div>
                  </label>
                </div>
              </div>
              <p className="max-w-[70%] text-xs text-gray-500 font-medium">
                When your project is set private, it can only be viewed or
                joined by invations.
              </p>
            </div>

            <div className="mt-10 flex flex-col justify-end space-y-3">
              <button
                className="px-3 py-1 bg-[#24a0ed] text-white hover:bg-[#24a0ed] hover:text-white font-medium rounded"
                type="submit"
              >
                {projectId ? "Update Project" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProjectState } from "../../Context/ProjectContext";
import { updateProject } from "../../utils/apicalls/project";
import toast from "react-hot-toast";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";

interface ProjectType {
  projectName: string;
  isPrivate: boolean;
}

const ProjectSettings = () => {
  const {
    project,
    members,
    setProject,
    loggedInUser: { id },
  } = ProjectState();
  console.log(members);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
    watch,
  } = useForm<ProjectType>();

  // const { isPrivate } = getValues();
  // console.log(isPrivate);

  const isPrivate = watch("isPrivate");
  console.log(isPrivate);

  const [isEdit, setIsEdit] = useState(false);

  const checkForAdmin = () => {
    let member = members.filter((member: any) => member.userId === id);
    console.log(member);
    if (member[0]?.role === "ADMIN") {
      return true;
    } else {
      return false;
    }
  };

  // const updateUserProject = handleSubmit(async (formData: ProjectType) => {
  //   const notification = toast.loading("Updating Project!");
  //   if (Object.keys(errors).length == 0) {
  //     try {
  //       await updateProject(
  //         projects,
  //         index,
  //         {
  //           id: projectId,
  //           name: formData.projectName,
  //           isPrivate: formData.isPrivate,
  //         },
  //         setProjects
  //       );
  //       closeModal();
  //       setIndex(0);
  //       toast.success("Project Updated!", {
  //         id: notification,
  //       });
  //     } catch (error: any) {
  //       toast.error(error.message, {
  //         id: notification,
  //       });
  //     }
  //   }
  // });

  const updateProject = handleSubmit(async (formData: any) => {
    const notification = toast.loading("Updating Project!");
    if (Object.keys(errors).length == 0) {
      try {
        await axios
          .post(`${urlFetcher()}/api/project/updatesettings`, {
            projectId: project.id,
            projectName: formData.projectName,
            isPrivate: formData.isPrivate,
          })
          .then((res) => {
            setProject(res.data);
            setIsEdit(!isEdit);
            toast.success("Project Updated!", {
              id: notification,
            });
          })
          .catch((error: any) => {
            console.error(error.message);
            toast.error(error.message, {
              id: notification,
            });
          });
      } catch (error: any) {
        console.log(error);
        toast.error(error.message, {
          id: notification,
        });
      }
    }
  });

  // useEffect(() => {
  //   updateProject();
  // }, [isPrivate]);

  const cancelUpdate = () => {
    setIsEdit(!isEdit);
    setValue("projectName", project.name ? project.name : "");
  };

  useEffect(() => {
    setValue("projectName", project.name ? project.name : "");
    setValue("isPrivate", project.isPrivate ? project.isPrivate : false);
  }, []);

  return (
    <div>
      <div>
        <form onSubmit={updateProject}>
          <div className="flex space-x-2 items-center w-full justify-between">
            <label className="font-bold text-xl text-gray-900">
              Project Settings
            </label>
            {checkForAdmin() && (
              <div>
                {!isEdit ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    onClick={() => setIsEdit(!isEdit)}
                    className="w-7 h-7 p-1 rounded-md cursor-pointer text-blue-500 hover:text-blue-900 hover:bg-blue-200"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                ) : (
                  <div className="flex space-x-2 ml-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      onClick={() => cancelUpdate()}
                      className="w-7 h-7 p-1 text-red-500 cursor-pointer
                  bg-red-200 hover:text-red-600 rounded-md"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <button type="submit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-7 h-7 p-1 text-green-500 cursor-pointer
                  bg-green-200 hover:text-green-600 rounded-md"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col space-y-3 w-ful">
              <label className="font-medium text-md text-gray-800">
                Project Name
              </label>

              <input
                className={`${
                  !isEdit
                    ? "bg-gray-300 border-none cursor-not-allowed"
                    : "bg-white border-gray-400"
                } w-full p-2 border  rounded-md focus:outline-none font-mediun`}
                placeholder="Enter Project Name"
                {...register("projectName", {
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
                readOnly={!isEdit}
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
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-md text-gray-800">
                Project Status
              </label>
              <div className="flex space-x-2 items-center justify-start">
                <span className="text-sm text-gray-500 w-[300px]">
                  When your project is set private, it can only be viewed or
                  joined by invations.
                </span>
                <label
                  htmlFor="default-toggle"
                  className="inline-flex relative items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    {...register("isPrivate")}
                    id="default-toggle"
                    className="sr-only peer"
                    disabled={!checkForAdmin()}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00FF00]"></div>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSettings;

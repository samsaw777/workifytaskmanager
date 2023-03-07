import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProjectState } from "../../Context/ProjectContext";

interface ProjectType {
  projectName: string;
  isPrivate: boolean;
}

const ProjectSettings = () => {
  const { project } = ProjectState();
  console.log(project);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    getValues,
  } = useForm<ProjectType>();

  const { isPrivate } = getValues();

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setValue("projectName", project.name ? project.name : "");
    setValue("isPrivate", project.isPrivate ? project.isPrivate : false);
  }, []);

  return (
    <div>
      <div>
        <form className="grid grid-cols-2 gap-2">
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
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-md">Project Status</label>
            <div className="flex space-x-2">
              <span>
                Want to make project {isPrivate ? "Public" : "Private"} ?
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
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00FF00]"></div>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSettings;

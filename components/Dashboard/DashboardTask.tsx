import React from "react";
import { returnUserProfile } from "../Project/Scrum/Backloq/Issue";
import TaskModal from "../Modals/TaskModal";

const DashboardTask = ({ task, index }: any) => {
  return (
    <>
      <div
        key={index}
        className="w-full py-4 px-4 bg-white shadow-md rounded-md"
      >
        <div className="flex justify-between w-full">
          <span className="text-sm">
            {task.projectId} / {task.sprintName} / {task.sectionName}
          </span>
          {/* <svg
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
          </svg> */}
        </div>
        <div className="mt-2">
          <p className="text-md font-bold">{task.title}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-xs">Desc</div>

          {returnUserProfile(task?.assignedUser?.profile)}
        </div>
      </div>

      {/* <TaskModal task={task} /> */}
    </>
  );
};

export default DashboardTask;

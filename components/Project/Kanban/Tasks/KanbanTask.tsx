import React, { useState, useRef } from "react";
import TaskModal, { Label } from "../../../Modals/TaskModal";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { ProjectState } from "../../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";

const KanbanTask = ({ issue, index, sectionName }: any) => {
  const { setSections, sections } = ProjectState();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<Label[] | []>(issue.labels);
  const [taskTitle, setTaskTitle] = useState<string>(issue.title);

  const taskTitleTRef = useRef<HTMLInputElement>(null);

  const updateTaskTitle = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios
        .post(`${urlFetcher()}/api/kanban/task/updatetasktitle`, {
          taskId: issue.id,
          title: taskTitle,
        })
        .then((response) => {
          let sectionIndex = sections.findIndex(
            (section) => section.id == issue.sectionId
          );
          let newData: any = JSON.parse(JSON.stringify(sections));
          const index = newData[sectionIndex].tasks.findIndex(
            (e: any) => e.id === issue.id
          );
          newData[sectionIndex].tasks[index].title = response.data.title;
          setSections(newData);
          setLoading(false);
          taskTitleTRef.current?.blur();
        });
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteTask = async (sectionId: number, taskId: string) => {
    const notification = Toast.loading("Deleting Task!");

    try {
      await axios
        .post(`${urlFetcher()}/api/kanban/deletetask`, {
          sectionId,
          taskId,
        })
        .then((res) => {
          Toast.success("Task Deleted!", {
            id: notification,
          });
          const newData = JSON.parse(JSON.stringify(sections));
          const sectionIndex = newData.findIndex((e: any) => e.id == sectionId);
          const taskIndex = newData[sectionIndex].tasks.findIndex(
            (e: any) => e.id == taskId
          );
          newData[sectionIndex].tasks.splice(taskIndex, 1);
          setSections(newData);
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-md p-2 flex flex-col space-y-2 border-t-4 border-t-blue-300  mb-3`}
    >
      <form
        className="flex space-x-1 px-1"
        onSubmit={(e) => updateTaskTitle(e)}
      >
        <input
          onChange={(e) => setTaskTitle(e.target.value)}
          value={taskTitle}
          className="w-full bg-transparent focus:border-2  focus:border-blue-700 focus:outline-none focus:bg-white p-1 rounded-md font-medium"
          placeholder="Untitled"
          ref={taskTitleTRef}
        />
        <button type="submit" className="hidden">
          sumit
        </button>
        {!loading && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-red-500 cursor-pointer hover:bg-red-200 hover:rounded-md p-2"
              // onClick={() => deleteSection(section.id)}
              onClick={() => deleteTask(issue.sectionId, issue.id)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </div>
        )}
        {loading && (
          //   currentTaskHeader?.taskIndex == taskIndex &&
          //   currentTaskHeader.sectionIndex == sectionIndex &&
          <div className="text-center flex items-center justify-center">
            <div role="status">
              <svg
                className="inline mr-2 w-6 h-6 text-gray-600 animate-spin fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </form>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <div className="flex flex-wrap p-1 gap-2">
          {labels?.map((label: Label, index: number) => (
            <div
              className="bg-gray-100 py-1 px-2 rounded-sm font-medium text-gray-600 text-sm"
              key={index}
            >
              {label.name}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs">Desc</div>
          {issue.profile !== "" ? (
            <div className="w-7 h-7 rounded-full items-center flex overflow-hidden">
              <Image
                src={issue.profile}
                width={100}
                height={100}
                alt="UserProfile"
              />
            </div>
          ) : (
            <FaUserCircle className="text-2xl text-violet-400 cursor-pointer" />
          )}
        </div>
      </div>
      {isOpen && (
        <TaskModal
          isOpen={isOpen}
          task={issue}
          sectionName={sectionName}
          setIsOpen={setIsOpen}
          setLabels={setLabels}
          labels={labels}
        />
      )}
    </div>
  );
};

export default KanbanTask;

/*


 <form className="flex space-x-1 px-1" >
            <input
                                        onChange={(e) =>
                                         {}
                                        }
                                        value={task.title}
                                        className="w-full bg-transparent focus:border-2  focus:border-blue-700 focus:outline-none focus:bg-white p-1 rounded-md font-medium"
                                        placeholder="Untitled"
                                      />
                                      <button type="submit" className="hidden">
                                        sumit
            </button>
            <form />


            ${
        snapshot.isDragging ? "cursor-grab" : "cursor-pointer"
      }

            */

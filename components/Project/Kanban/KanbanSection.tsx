import React, { useState, useEffect, useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanTask from "./Tasks/KanbanTask";
import { ProjectState } from "../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import {
  deleteSection,
  updateSection,
} from "../../../utils/Helper/SectionFIle";
import io, { Socket } from "socket.io-client";
let socket: Socket;

interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
  profile: string;
  username: string;
  position: number;
  sectionId: number;
}

interface Props {
  id: number;
  title: string;
  tasks: Task[];
  boardId: number;
  index: number;
}

export let kanbanSectionHeader: HTMLInputElement | any;

const KanbanSection = ({ id, title, tasks, boardId, index }: Props) => {
  const {
    loggedInUser,
    sections,
    setSections,
    members,
    project: { id: projectId },
  } = ProjectState();

  const [loading, setLoading] = useState<boolean>(false);
  const [sectionTitle, setSectionTitle] = useState<string>(title);
  kanbanSectionHeader = useRef<HTMLInputElement | any>(null);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  useEffect(() => {
    socketInit();
  }, []);

  useEffect(() => {
    setSectionTitle(title);
  }, [title]);

  //   const updateSection = async (
  //     e: any,
  //     boardId: number,
  //     title: string,
  //     id: number,
  //     setSectionTitle: React.Dispatch<React.SetStateAction<string>>,
  //     setLoading: React.Dispatch<React.SetStateAction<boolean>>
  //   ) => {
  //     e.preventDefault();
  //     try {
  //       setLoading(true);
  //       await axios
  //         .post(`${urlFetcher()}/api/section/updatesection`, {
  //           boardId,
  //           title,
  //           id,
  //         })
  //         .then((response) => {
  //           setSectionTitle(response.data.title);
  //           setLoading(false);
  //           let newData: any = JSON.parse(JSON.stringify(sections));

  //           const index = newData.findIndex(
  //             (e: any) => e.id === response.data.id
  //           );

  //           newData[index].title = response.data.title;

  //           setSections(newData);
  //         });
  //     } catch (error: any) {
  //       console.log(error.message);
  //       setLoading(false);
  //     }
  //   };

  const createTask = async (sectionId: number) => {
    const notification = Toast.loading("Creating Task");
    try {
      await axios
        .post(`${urlFetcher()}/api/kanban/createtask`, {
          sectionId,
          title: "",
          userId: loggedInUser.id,
          username: loggedInUser.username,
          profile: loggedInUser.profile,
        })
        .then((res) => {
          socket.emit("taskCreated", {
            ProjectId: projectId,
            members,
            task: res.data,
            type: "createtask",
            section: "kanban",
            sections,
          });

          Toast.success("Task Created!", { id: notification });
        });
    } catch (error: any) {
      Toast.error(error.message, { id: notification });
    }
  };

  return (
    <div key={id} className="h-full flex-none bg-gray-100 w-[350px] rounded-md">
      <form
        className="flex space-x-1 px-2 py-2 border-b-2 border-b-gray-300"
        onSubmit={(e) =>
          updateSection(
            e,
            boardId,
            sectionTitle,
            id,
            setSectionTitle,
            setLoading,
            socket,
            projectId,
            members,
            sections
          )
        }
      >
        <input
          onChange={(e) => setSectionTitle(e.target.value)}
          value={sectionTitle}
          ref={kanbanSectionHeader}
          className="w-full bg-transparent focus:border-2  focus:border-blue-300 focus:outline-none focus:bg-white p-1 rounded-md font-medium"
          placeholder="Untitled"
        />
        <button className="hidden" type="submit">
          Submit
        </button>
        {!loading && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-300 cursor-pointer"
              onClick={() => deleteSection(id, socket, projectId, members)}
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
      <Droppable key={id.toString()} droppableId={id.toString()}>
        {(provided) => (
          <div
            className="flex flex-col space-y-2 px-2 mt-2 h-[65vh] overflow-y-auto taskarea"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div>
              {tasks?.map((task: Task, index: number) => (
                <div key={index}>
                  <KanbanTask issue={task} index={index} sectionName={title} />
                </div>
              ))}
            </div>

            {provided.placeholder}

            <div
              className="text-md rounded-md p-2 font-medium hover:bg-gray-200 cursor-pointer text-gray-700"
              onClick={() => createTask(id)}
            >
              + Add Task
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanSection;

import React, { useState } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { ProjectState } from "../../Context/ProjectContext";
import io, { Socket } from "socket.io-client";

let socket: Socket;

const SprintModal = ({ children }: any) => {
  const { sprints, setSprints, project, members } = ProjectState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sprintName, setSprintName] = useState<string>("");

  const cancelSprint = () => {
    setSprintName("");
    setIsOpen(!isOpen);
  };

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  React.useEffect(() => {
    socketInit();
  }, []);

  //function to create Sprints.
  const createSprint = async (e: any) => {
    e.preventDefault();
    const notification = Toast.loading("Creating Sprint");
    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/sprint/createsprint`, {
          sprintName,
          boardId: parseInt(project.board[0].id),
        })
        .then((res) => {
          socket.emit("sprintCreated", {
            ProjectId: project.id,
            sprint: res.data,
            members,
            type: "addsprint",
            section: "backlog",
          });
          // setSprints([...sprints, res.data]);
          cancelSprint();
          Toast.success("Sprint Created!", {
            id: notification,
          });
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      <div
        className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
          isOpen ? "flex" : "hidden"
        } justify-center items-center `}
        id="overlay"
        //   onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bg-white w-[550px] py-6 px-4 rounded-md shadow-xl text-gray-800">
          <div className="flex">
            <span className="flex-grow w-full text-gray-700 text-md font-semibold">
              Create Sprint
            </span>

            <svg
              className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-full"
              id="close-modal"
              fill="currentColor"
              viewBox="0 0 20 20"
              onClick={() => setIsOpen(!isOpen)}
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="mt-3">
            <form onSubmit={(e) => createSprint(e)}>
              <input
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                placeholder="Enter Sprint Name"
                className="w-[60%] p-2 rounded-md bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-blue-300 focus:bg-white text-gray-600 placeholder:text-gray-500"
              />

              <div className="flex space-x-3 justify-end items-center mt-2">
                <button
                  className="px-3 py-1 rounded   text-red-400 border border-red-300  hover:font-bold"
                  type="button"
                  onClick={() => cancelSprint()}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-green-500 text-white hover:bg-green-600 hover:text-white font-medium rounded"
                  type="submit"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SprintModal;

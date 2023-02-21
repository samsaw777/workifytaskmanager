import { FunctionComponent, useState, useEffect, useMemo } from "react";
import { BiChevronDown } from "react-icons/bi";
import Image from "next/image";
import TaskLabel from "../Project/Kanban/Tasks/TaskLabels";
import { ProjectState } from "../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import TaskComments from "../Project/Kanban/Tasks/TaskComments";
import io, { Socket } from "socket.io-client";
import { number } from "yup";
import { FaUserCircle } from "react-icons/fa";
import Toast from "react-hot-toast";
let socket: Socket;

export interface Label {
  id: number;
  name: string;
  taskId: number;
}

export interface IssueLabels {
  id: number;
  name: string;
  issueId: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedUser: any;

  userId: string;
  username: string;
  profile: string;
  position: number;
  sectionId: number;
  labels: Label[] | [];
}

//Interface For Issue In Scrumboard.
export interface Issue {
  id: number;
  type: string;
  description: string;
  assignedUser: any;
  title: string;
  username: string;
  profile: string;
  position: number;
  sectionId: number;
  labels: IssueLabels[] | [];
}

interface Props {
  isOpen: boolean;
  task: Task | Issue;
  sectionName: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLabels: React.Dispatch<React.SetStateAction<[] | Label[] | IssueLabels[]>>;
  labels: Label[] | IssueLabels[] | [];
  type: string;
}

const TaskModal: FunctionComponent<Props> = ({
  isOpen,
  task,
  sectionName,
  setIsOpen,
  setLabels,
  type,
  labels,
}: Props) => {
  const closeTaskModal = () => {
    setIsOpen(!isOpen);
  };
  const {
    sections,
    sprints,
    comments,
    setComments,
    project: { id: ProjectId },
    scrumSections,
    members,
  } = ProjectState();
  const [loading, setLoading] = useState(false);
  // console.log(task);

  useEffect(() => {
    setDescription(task.description);
    setTitle(task.title);
  }, [task.title, task.description]);

  const [title, setTitle] = useState<string>(task.title);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [descLoading, setDescLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(task.description);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  // const [comments, setComments] = useState<{}[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [openAssignUser, setOpenAssignUser] = useState<boolean>(false);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  useEffect(() => {
    socketInit();
  }, []);

  const getSectionsForTaskModal = (type: string) => {
    switch (type) {
      case "scrum":
        return sprints;
      case "kanban":
        return sections;
      case "scrumSection":
        return scrumSections;
    }
  };
  const getSectionForTaskModal = (type: string) => {
    switch (type) {
      case "scrum":
        return "sprint";
      case "kanban":
        return "kanban";
      case "scrumSection":
        return "scrumSection";
    }
  };

  const fetchTaskComments = async () => {
    try {
      setCommentsLoading(true);
      await axios
        .post(
          `${urlFetcher()}/api/comments/${
            type == "kanban" ? "gettaskcomments" : "getissuecomments"
          }`,
          {
            taskId: task.id,
          }
        )
        .then((res) => {
          setComments(res.data);

          setCommentsLoading(false);
        });
    } catch (error: any) {
      console.log(error);
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    // console.log("Fetching");

    fetchTaskComments();
  }, []);

  const updateAssignedUser = async (
    userId: string,
    memberInfo: { username: string; profile: string; userId: string }
  ) => {
    const notification = Toast.loading("Assigning to user!");
    try {
      await axios
        .patch(
          `${urlFetcher()}${
            type === "scrum" || type === "scrumSection"
              ? "/api/scrum/issue/scrumissue"
              : "/api/kanban/kanbantask"
          }`,
          {
            type: "assigned",
            value: userId,
            taskId: task.id,
          }
        )
        .then((response) => {
          socket.emit("taskCreated", {
            ProjectId,
            members,
            task: {
              memberInfo,
              id: response.data.id,
              sectionId: response.data.sectionId,
              sprintId: response.data.sprintId,
            },
            type: "updateAssignTo",
            section: getSectionForTaskModal(type),
            sections: getSectionsForTaskModal(type),
          });
          setOpenAssignUser(false);
          Toast.success("User assignment successfully!", { id: notification });
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  const updateTaskInformation = async (e: any, updateType: string) => {
    e.preventDefault();
    try {
      if (updateType == "title") {
        setLoading(true);
      } else {
        setDescLoading(true);
      }
      await axios
        .patch(
          `${urlFetcher()}${
            type === "scrum" || type === "scrumSection"
              ? "/api/scrum/issue/scrumissue"
              : "/api/kanban/kanbantask"
          }`,
          {
            taskId: task.id,
            value: updateType == "title" ? title : description,
            type: updateType,
          }
        )
        .then((response) => {
          socket.emit("taskCreated", {
            ProjectId,
            members,
            task: response.data,
            type: updateType === "title" ? "updatetask" : "updatedescription",
            section: getSectionForTaskModal(type),
            sections: getSectionsForTaskModal(type),
          });

          if (updateType == "title") {
            setLoading(false);
          } else {
            setShowDescription(false);
            setDescLoading(false);
          }
        });
    } catch (error: any) {
      console.log(error.message);
      if (updateType == "title") {
        setLoading(false);
      } else {
        setShowDescription(false);
        setDescLoading(false);
      }
    }
  };

  return (
    <div
      className={`bg-gray-700 z-10 bg-opacity-50 absolute inset-0 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center `}
      id="overlay"
    >
      <div className="bg-white w-[1200px] max-h-[600px] py-4 px-4 rounded-md shadow-xl text-gray-800">
        <div className="flex justify-between">
          <div>
            {sectionName} / {task.title}
          </div>
          <svg
            className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-md"
            id="close-modal"
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => closeTaskModal()}
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="w-full flex mt-2">
          <div className="w-[65%] pr-5">
            <div className="mt-2">
              <form
                onSubmit={(e) => {
                  updateTaskInformation(e, "title");
                }}
              >
                {/* Project Title */}
                <div className="flex space-x-2">
                  <input
                    placeholder="Add task a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="py-1 px-2 text-gray-900 hover:bg-gray-200 w-full text-2xl font-medium focus:bg-white focus:border-2 focus:border-blue-400 focus:outline-none rounded-md placeholder:text-md"
                  />
                  <button type="submit" className="hidden">
                    Submit
                  </button>
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
                </div>
              </form>

              {/* Description Div */}
              <div className="mt-2">
                <div className="flex justify-between">
                  <div className="px-2 text-gray-700 font-medium text-[15px]">
                    Description
                  </div>
                  {descLoading && (
                    <div className="text-center flex items-center justify-center">
                      <div role="status">
                        <svg
                          className="inline mr-2 w-4 h-4 text-gray-600 animate-spin fill-white"
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
                </div>
                <div
                  className={`py-1 px-2 hover:bg-gray-200 rounded-md text-sm cursor-pointer ${
                    !showDescription ? "block" : "hidden"
                  }`}
                  onClick={() => setShowDescription(true)}
                >
                  {description ? description : "Add a description..."}
                </div>
                <div
                  className={`w-full ${
                    showDescription ? "block" : "hidden"
                  } px-2`}
                >
                  <form
                    onSubmit={(e) => {
                      updateTaskInformation(e, "description");
                    }}
                  >
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Click to add the description!"
                      className="p-1 w-full text-lg placeholder:text-sm placeholder:text-gray-900 font-normal focus:bg-white border-2 border-gray-200 h-32 focus:outline-none rounded-sm"
                    />

                    <div className="flex space-x-2 mt-2">
                      <button
                        type="submit"
                        className="w-fit py-2 px-4 bg-blue-700 font-medium rounded-md text-white text-sm"
                      >
                        Save
                      </button>
                      <div
                        className="w-fit text-gray-700 py-2 px-4 hover:bg-gray-200 cursor-pointer rounded-md text-sm"
                        onClick={() => setShowDescription(false)}
                      >
                        Cancel
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex flex-col space-y-3 mt-2">
                <div className="px-2 text-gray-700 font-medium text-[15px]">
                  Activity
                </div>

                <TaskComments
                  taskId={type === "kanban" ? task.id.toString() : task.id}
                  loading={commentsLoading}
                  type={type}
                />
              </div>
            </div>
          </div>
          <div className="w-[35%]">
            <div className="rounded-md">
              <div
                className="border-2 border-gray-200 p-2 text-sm text-gray-900 font-medium flex justify-between items-center cursor-pointer hover:bg-gray-200"
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>
                  Deatils{" "}
                  <span className="text-xs text-gray-400">
                    {!showDetails && "Reporter"}
                  </span>
                </span>
                <BiChevronDown
                  className={`text-lg ${showDetails && "rotate-180"}`}
                />
              </div>
              <div
                className={`p-2 border-x-2 border-b-2 border-gray-200 ${
                  showDetails ? "block" : "hidden"
                }`}
              >
                <div className="flex flex-col space-y-3">
                  <div className="grid grid-cols-2 align-middle">
                    <div className="text-sm text-gray-500 font-medium">
                      Reporter
                    </div>
                    <div className="text-sm text-black font-normal flex space-x-2 items-center">
                      <div className="w-7 h-7 rounded-full items-center flex overflow-hidden">
                        <Image
                          src={task.profile}
                          width={100}
                          height={100}
                          alt="UserProfile"
                        />
                      </div>
                      <div>{task.username}</div>
                    </div>
                  </div>
                  <TaskLabel
                    taskId={task.id}
                    setLabels={setLabels}
                    labels={labels}
                    task={task}
                    type={type}
                  />
                  <div className="grid grid-cols-2 align-middle">
                    <div className="text-sm text-gray-500 font-medium">
                      Asignee
                    </div>
                    <div className="w-full">
                      {task.assignedUser != null ? (
                        <div
                          className="text-sm text-black font-normal cursor-pointer flex space-x-2 items-center px-3 py-2 group hover:bg-gray-300"
                          onClick={() => setOpenAssignUser(!openAssignUser)}
                        >
                          {task.assignedUser.profile ? (
                            <div className="w-6 h-6 rounded-full items-center flex overflow-hidden max-w-10 group-hover:bg-gray-300">
                              <Image
                                src={task.assignedUser.profile}
                                width={100}
                                height={100}
                                alt="UserProfile"
                              />
                            </div>
                          ) : (
                            <FaUserCircle className="text-sm text-violet-400 cursor-pointer" />
                          )}
                          <div className="group-hover:bg-gray-300">
                            {task.assignedUser.username}
                          </div>
                        </div>
                      ) : (
                        <span
                          className="bg-gray-200 w-full flex py-1 px-2 items-center space-x-1 "
                          onClick={() => setOpenAssignUser(!openAssignUser)}
                        >
                          <FaUserCircle className="text-lg text-gray-400 cursor-pointer" />
                          <span className="text-sm text-gray-500">
                            unassigned
                          </span>
                        </span>
                      )}

                      {openAssignUser && (
                        <div className="w-full mt-2">
                          <div className="bg-white border-2 border-gray-200 shadow-sm p-1 rounded-md z-10">
                            {members.map((member: any, index: number) => (
                              <div
                                className={`text-sm text-black font-normal cursor-pointer flex space-x-2 items-center px-3 py-2 group hover:bg-gray-300 ${
                                  task.assignedUser !== null &&
                                  task.assignedUser?.username ==
                                    member.username &&
                                  "bg-gray-200"
                                }`}
                                key={index}
                                onClick={() =>
                                  updateAssignedUser(member.userId, {
                                    username: member.username,
                                    profile: member.profileImage,
                                    userId: member.userId,
                                  })
                                }
                              >
                                {member.profileImage ? (
                                  <div className="w-5 h-5 rounded-full items-center flex overflow-hidden max-w-10 group-hover:bg-gray-300">
                                    <Image
                                      src={member.profileImage}
                                      width={100}
                                      height={100}
                                      alt="UserProfile"
                                    />
                                  </div>
                                ) : (
                                  <FaUserCircle className="text-sm text-violet-400 cursor-pointer" />
                                )}
                                <div className="group-hover:bg-gray-300">
                                  {member.username}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

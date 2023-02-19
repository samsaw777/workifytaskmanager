import React, { useState } from "react";
import { ProjectState } from "../../../../Context/ProjectContext";
import { AiFillEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { MdArrowDropDown } from "react-icons/md";
import { Droppable } from "react-beautiful-dnd";
import Issue from "../Backloq/Issue";
import SprintModal from "../../../Modals/SprintModal";
import { Socket } from "socket.io-client";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Toast from "react-hot-toast";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import axios from "axios";

interface Sprint {
  sprintName: string;
  boardId: number;
  id: number;
}

interface Props {
  sprint: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateIssueDetails: React.Dispatch<
    React.SetStateAction<{
      type: string;
      id: number;
      title: string;
      sprintId: number;
      index: number;
      description: string;
    }>
  >;
  index: number;
  setSprintDetails: React.Dispatch<
    React.SetStateAction<{
      id: number;
      sprintName: string;
      startDate: Date;
      endDate: Date;
    }>
  >;
  socket: Socket;
  setUpdateSprintDetails: React.Dispatch<
    React.SetStateAction<{
      sprintId: number;
      index: number;
      sprintName: string;
      startDate: Date;
      endDate: Date;
    }>
  >;
  updateSprintDetails: {
    sprintId: number;
    index: number;
    sprintName: string;
    startDate: Date;
    endDate: Date;
  };
}

const Sprint = ({
  sprint,
  isOpen,
  setIsOpen,
  setUpdateIssueDetails,
  index,
  setSprintDetails,
  socket,
  setUpdateSprintDetails,
  updateSprintDetails,
}: Props) => {
  const {
    sprints,
    setSprints,
    members,
    project: { id },
  } = ProjectState();
  const openIssueModal = () => {
    setIsOpen(!isOpen);
    setSprintDetails({
      id: sprint.id,
      sprintName: sprint.sprintName,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    });
  };
  const [isSprintModalOpen, setIsSprintModalOpen] = useState<boolean>(false);

  const [openSprint, setOpenSprint] = useState<boolean>(true);
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const openUpdateModal = (
    sprintId: number,
    sprintIndex: number,
    sprintName: string,
    startDate: Date,
    endDate: Date
  ) => {
    setUpdateSprintDetails({
      sprintId,
      index: sprintIndex,
      sprintName,
      startDate,
      endDate,
    });
    setIsSprintModalOpen(!isSprintModalOpen);
    setOpenOptions(!openOptions);
  };

  const deleteSprint = async (sprintId: number) => {
    const notification = Toast.loading("Deleting Sprint!");
    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/sprint/deletesprint`, {
          sprintId,
        })
        .then((res) => {
          socket.emit("sprintCreated", {
            ProjectId: id,
            sprint: res.data,
            members,
            type: "deletesprint",
            section: "backlog",
          });
          setOpenOptions(openOptions);
          Toast.success("Sprint Deleted!", {
            id: notification,
          });
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  const setSprintStatus = async (status: string) => {
    const notification = Toast.loading("Starting Sprint!");

    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/sprint/updatesprint`, {
          sprintId: sprint.id,
          sprintName: sprint.sprintName,
          updateStatus: status,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
        })
        .then((response) => {
          Toast.success("Sprint Deleted!", {
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
    <div
      className={`flex flex-col space-y-2 ${
        !sprint.isPrimary && "bg-gray-100"
      }  px-3 py-2`}
      key={index}
    >
      <div className="w-full flex justify-between items-center">
        <div
          className="flex space-x-1 items-center cursor-pointer flex-1 py-1"
          onClick={() => setOpenSprint(!openSprint)}
        >
          <MdArrowDropDown
            className={`text-2xl ${
              !openSprint && "-rotate-90"
            } transition duration-150`}
          />
          <span className="font-bold">{sprint.sprintName}</span>
          {sprint.startDate !== null && (
            <span className="text-xs ml-2">
              {new Date(sprint.startDate).getDate()}{" "}
              {monthNames[new Date(sprint.startDate).getMonth()]} -
            </span>
          )}{" "}
          {sprint.endDate !== null && (
            <span className="text-xs">
              {new Date(sprint.endDate).getDate()}{" "}
              {monthNames[new Date(sprint.endDate).getMonth()]}
            </span>
          )}
        </div>

        {sprint.isPrimary && (
          <div
            className="bg-gray-100 text-gray-600 px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200"
            onClick={() => setIsSprintModalOpen(!isSprintModalOpen)}
          >
            Create sprint
          </div>
        )}

        {!sprint.isPrimary && !sprint.isUnderStartSprint && (
          <button
            className={`bg-gray-200 text-gray-600 px-3 py-1 font-semibold hover:bg-gray-200 ${
              sprint?.issues?.length > 0
                ? "cursor-pointer"
                : "cursor-not-allowed"
            }`}
            disabled={sprint?.issues?.length > 0 ? false : true}
            onClick={() => setSprintStatus("UPDATESPRINTSTATUS")}
          >
            Start sprint
          </button>
        )}

        {!sprint.isPrimary && sprint.isUnderStartSprint && (
          <div className="bg-gray-200 text-gray-600 px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200">
            Complete sprint
          </div>
        )}

        {sprint.sprintName != "BACKLOG" && (
          <div className="relative mx-2 cursor-pointer">
            <BiDotsVerticalRounded
              className="curosr-pointer hover:bg-blue-200 text-2xl rounded-sm p-1"
              onClick={() => setOpenOptions(!openOptions)}
            />
            {openOptions && (
              <div className="absolute w-[140px] bg-white shadow-md rounded-md right-2 top-8 z-10  flex flex-col">
                <div
                  className="flex space-x-2 items-center cursor-pointer hover:bg-gray-100 px-4 py-2"
                  // onClick={() =>
                  //   updateIssue({
                  //     id: issue.id,
                  //     issue: issue.issue,
                  //     type: issue.type,
                  //     sprintId: issue.sprintId,
                  //     index,
                  //   })
                  // }
                >
                  <AiFillEdit className="text-green-500" />

                  <span
                    className="text-sm"
                    onClick={() =>
                      openUpdateModal(
                        sprint.id,
                        index,
                        sprint.sprintName,
                        sprint.startDate,
                        sprint.endDate
                      )
                    }
                  >
                    Edit Sprint
                  </span>
                </div>

                <div
                  className="flex space-x-2 items-center cursor-pointer hover:bg-gray-100 px-4 py-2"
                  onClick={() => deleteSprint(sprint.id)}
                >
                  <AiOutlineDelete className="text-red-500" />
                  <span className="text-sm">Delete Sprint</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {openSprint && (
        <Droppable
          key={sprint.id.toString()}
          droppableId={sprint.id.toString()}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              // className={`${openBacklog ? "block" : "hidden"}`}
            >
              {sprint?.issues?.length > 0 ? (
                <div>
                  {sprint?.issues?.map((issue: any, index: number) => {
                    return (
                      <div key={index}>
                        <Issue
                          issue={issue}
                          index={index}
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                          setUpdateIssueDetails={setUpdateIssueDetails}
                          socket={socket}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`w-full flex h-10 border-2 ${
                    !sprint.isPrimary
                      ? "text-gray-400 border-gray-400/[.6]"
                      : "text-blue-600 border-blue-100"
                  }  border-dashed  text-xs justify-center items-center`}
                >
                  {sprint.isPrimary
                    ? "Your backlog is empty.."
                    : "Add some issues into the sprint by dragging the issues here."}
                </div>
              )}
              {provided.placeholder}

              <div
                className="flex space-x-2 items-center text-sm mt-1  p-2 group hover:bg-gray-200 cursor-pointer"
                onClick={() => openIssueModal()}
              >
                <AiOutlinePlus className="" />
                <span>Create Issue</span>
              </div>
            </div>
          )}
        </Droppable>
      )}
      <SprintModal
        setUpdateSprintDetails={setUpdateSprintDetails}
        updateSprintDetails={updateSprintDetails}
        setIsSprintModalOpen={setIsSprintModalOpen}
        isSprintModalOpen={isSprintModalOpen}
      />
    </div>
  );
};

export default Sprint;

/*

1. Add a check in the create issue fucntion by sending props.
2. Make Droppable id as spritName / backlogName.

*/

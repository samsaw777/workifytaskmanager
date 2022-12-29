import React, { useState } from "react";
import { ProjectState } from "../../../../Context/ProjectContext";
import { AiOutlinePlus } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/Ri";
import { Droppable } from "react-beautiful-dnd";
import Issue from "../Backloq/Issue";
import SprintModal from "../../../Modals/SprintModal";
import { Socket } from "socket.io-client";
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
      issue: string;
      sprintId: number;
      index: number;
    }>
  >;
  index: number;
  setSprintDetails: React.Dispatch<
    React.SetStateAction<{ id: number; sprintName: string }>
  >;
  socket: Socket;
}

const Sprint = ({
  sprint,
  isOpen,
  setIsOpen,
  setUpdateIssueDetails,
  index,
  setSprintDetails,
  socket,
}: Props) => {
  const openIssueModal = () => {
    setIsOpen(!isOpen);
    setSprintDetails({ id: sprint.id, sprintName: sprint.sprintName });
  };

  const { issues } = ProjectState();
  const [openSprint, setOpenSprint] = useState<boolean>(true);
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
          <RiArrowDropDownLine
            className={`text-2xl ${
              !openSprint && "-rotate-90"
            } transition duration-150`}
          />
          <span>{sprint.sprintName}</span>
        </div>

        {sprint.isPrimary && (
          <SprintModal>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200">
              create sprint
            </div>
          </SprintModal>
        )}

        {!sprint.isPrimary && (
          <div className="bg-gray-200 text-gray-600 px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200">
            start sprint
          </div>
        )}
      </div>
      {openSprint && (
        <Droppable key="sprintOne" droppableId={sprint.id.toString()}>
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
                      <Issue
                        issue={issue}
                        index={index}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        setUpdateIssueDetails={setUpdateIssueDetails}
                        socket={socket}
                      />
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
    </div>
  );
};

export default Sprint;

/*

1. Add a check in the create issue fucntion by sending props.
2. Make Droppable id as spritName / backlogName.

*/

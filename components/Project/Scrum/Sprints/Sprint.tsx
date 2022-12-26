import React, { useState } from "react";
import { ProjectState } from "../../../../Context/ProjectContext";
import { AiOutlinePlus } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/Ri";
import { Droppable } from "react-beautiful-dnd";
import Issue from "../Backloq/Issue";
interface Sprint {
  sprintName: string;
  boardId: number;
}

interface Props {
  sprint: Sprint;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateIssueDetails: React.Dispatch<
    React.SetStateAction<{
      type: string;
      id: number;
      issue: string;
      index: number;
    }>
  >;
  index: number;
}

const Sprint = ({
  sprint,
  isOpen,
  setIsOpen,
  setUpdateIssueDetails,
  index,
}: Props) => {
  const { issues } = ProjectState();
  const [openSprint, setOpenSprint] = useState<boolean>(true);
  return (
    <div className="flex flex-col space-y-2 bg-gray-100  px-3 py-2" key={index}>
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

        <div className="bg-gray-200 text-gray-600 px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200">
          start sprint
        </div>
      </div>
      {openSprint && (
        <Droppable key="sprintOne" droppableId={"3".toString()}>
          {(provided) => (
            <div
              // className={`${openBacklog ? "block" : "hidden"}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {[
                ...issues.filter(
                  (issues: any) => issues.sprintName == sprint.sprintName
                ),
              ].length > 0 ? (
                <div>
                  {[
                    ...issues.filter(
                      (issues: any) => issues.sprintName == sprint.sprintName
                    ),
                  ].map((issue, index: number) => {
                    return (
                      <Issue
                        issue={issue}
                        index={index}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        setUpdateIssueDetails={setUpdateIssueDetails}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              ) : (
                <div className="w-full flex h-10 border-2 text-gray-400 border-dashed border-gray-400/[.6] text-xs justify-center items-center">
                  Add some issues into the sprint by dragging the issues here.
                </div>
              )}

              <div
                className="flex space-x-2 items-center text-sm mt-1  p-2 group hover:bg-gray-200 cursor-pointer"
                // onClick={() => setIsOpen(!isOpen)}
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

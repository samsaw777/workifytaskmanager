import React, { useState } from "react";
import Image from "next/image";
import { colorFetcher } from "../../../../utils/Helper/colorFetcher";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineDelete, AiFillEdit } from "react-icons/ai";
import Toast from "react-hot-toast";
import { ProjectState } from "../../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import { Draggable } from "react-beautiful-dnd";
interface Issue {
  id: number;
  type: string;
  issue: string;
  projectId: number;
  username: string;
  profile: string;
  userId: string;
  sectionId: number;
  sectionName: string;
}

type UpdateIssue = {
  type: string;
  id: number;
  issue: string;
  index: number;
};
interface Props {
  issue: Issue;
  index: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateIssueDetails: React.Dispatch<React.SetStateAction<UpdateIssue>>;
}

const Issue = ({
  issue,
  index,
  isOpen,
  setIsOpen,
  setUpdateIssueDetails,
}: Props) => {
  const { issues, setIssues } = ProjectState();
  const [openOption, setOpenOption] = useState<boolean>(false);

  const updateIssue = (issue: UpdateIssue) => {
    setUpdateIssueDetails(issue);
    setIsOpen(!isOpen);
    setOpenOption(!openOption);
  };

  //Delete Issue.
  const deleteIssue = async (issueId: number) => {
    const notification = Toast.loading("Deleting Issue!");

    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/issue/deleteissue`, {
          issueId,
        })
        .then((response) => {
          setIssues([
            ...issues.filter((issue) => issue.id != response.data.id),
          ]);

          Toast.success("Issue Deleted!", {
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
    <Draggable index={index} key={issue.id} draggableId={issue.id.toString()}>
      {(provided, snapshot) => (
        <div
          className={`${
            snapshot.isDragging ? "cursor-grab" : "cursor-pointer"
          }w-full p-2 flex justify-between border-[2px] mt-1 border-gray-200`}
          key={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex space-x-3 items-center">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: `${colorFetcher(issue.type)}`,
              }}
            ></div>
            <div className=" text-xs">NEW {index + 1}</div>
            <div className="text-sm">{issue.issue}</div>
          </div>
          <div className="flex space-x-3 items-center">
            <div className="py-1 px-4 bg-gray-300 rounded-sm text-xs">
              {issue.sectionName}
            </div>
            <div className="w-7 h-7 rounded-full items-center flex overflow-hidden">
              <Image
                src={issue.profile}
                width={100}
                height={100}
                alt="UserProfile"
              />
            </div>
            <div className="relative">
              <BiDotsVerticalRounded
                className="curosr-pointer hover:bg-blue-200 text-2xl rounded-sm p-1"
                onClick={() => setOpenOption(!openOption)}
              />
              {openOption && (
                <div className="absolute w-[140px] bg-white shadow-md rounded-md right-2 top-7 z-10  flex flex-col">
                  <div
                    className="flex space-x-2 items-center cursor-pointer hover:bg-gray-100 px-4 py-2"
                    onClick={() =>
                      updateIssue({
                        id: issue.id,
                        issue: issue.issue,
                        type: issue.type,
                        index,
                      })
                    }
                  >
                    <AiFillEdit className="text-green-500" />
                    <span className="text-sm">Edit Issue</span>
                  </div>
                  <div
                    className="flex space-x-2 items-center cursor-pointer hover:bg-gray-100 px-4 py-2"
                    onClick={() => deleteIssue(issue.id)}
                  >
                    <AiOutlineDelete className="text-red-500" />
                    <span className="text-sm">Delete Issue</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Issue;

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
import { Socket } from "socket.io-client";
import IssueInfoModal, { IssueLabels, Label } from "../../../Modals/TaskModal";
interface Issue {
  id: number;
  type: string;
  titile: string;
  description: string;
  projectId: number;
  username: string;
  profile: string;
  userId: string;
  sprintId: number;
  sprintName: string;
}

type UpdateIssue = {
  type: string;
  id: number;
  title: string;
  sprintId: number;
  description: string;
  index: number;
};
interface Props {
  issue: any;
  index: number;
  isOpen: boolean;
  socket?: Socket;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateIssueDetails: React.Dispatch<React.SetStateAction<UpdateIssue>>;
}

const Issue = ({
  issue,
  index,
  isOpen,
  setIsOpen,
  socket,
  setUpdateIssueDetails,
}: Props) => {
  const {
    sprints,
    setSprints,
    project: { id },
    members,
  } = ProjectState();
  const [openOption, setOpenOption] = useState<boolean>(false);

  const updateIssue = (issue: UpdateIssue) => {
    setUpdateIssueDetails(issue);
    setIsOpen(!isOpen);
    setOpenOption(!openOption);
  };

  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<IssueLabels[] | [] | Label[]>(
    issue.labels
  );

  //Delete Issue.
  const deleteIssue = async (issueId: number, sprintId: number) => {
    const notification = Toast.loading("Deleting Issue!");

    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/issue/deleteissue`, {
          issueId,
        })

        .then((response) => {
          socket?.emit("issueCreated", {
            projectId: id,
            members,
            sprintId: sprintId,
            issue: response.data,
            section: "backlog",
            type: "deleteissue",
            sprints,
          });
          setOpenOption(!openOption);

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
    <Draggable
      index={index}
      key={issue.id.toString()}
      draggableId={issue.id.toString()}
    >
      {(provided, snapshot) => (
        <div
          className={`${
            snapshot.isDragging ? "cursor-grab" : "cursor-pointer"
          }w-full p-2 flex justify-between border-[2px] mt-1 border-gray-200 bg-white`}
          key={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className="flex space-x-3 items-center cursor-pointer"
            onClick={() => setIsIssueModalOpen(!isIssueModalOpen)}
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: `${colorFetcher(issue.type)}`,
              }}
            ></div>
            <div className=" text-xs">NEW {index + 1}</div>
            <div className="text-sm">{issue.title}</div>
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
                        title: issue.title,
                        type: issue.type,
                        sprintId: issue.sprintId,
                        description: issue.description,
                        index,
                      })
                    }
                  >
                    <AiFillEdit className="text-green-500" />
                    <span className="text-sm">Edit Issue</span>
                  </div>
                  <div
                    className="flex space-x-2 items-center cursor-pointer hover:bg-gray-100 px-4 py-2"
                    onClick={() => deleteIssue(issue.id, issue.sprintId)}
                  >
                    <AiOutlineDelete className="text-red-500" />
                    <span className="text-sm">Delete Issue</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {isIssueModalOpen && (
            <IssueInfoModal
              isOpen={isIssueModalOpen}
              task={issue}
              sectionName={issue.sprintName}
              setIsOpen={setIsIssueModalOpen}
              setLabels={setLabels}
              labels={labels}
              type="scrum"
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Issue;

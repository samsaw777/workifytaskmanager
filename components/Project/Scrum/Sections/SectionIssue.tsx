import React, { useState } from "react";
import { colorFetcher } from "../../../../utils/Helper/colorFetcher";
import { Draggable } from "react-beautiful-dnd";
import IssueModal from "../../../Modals/TaskModal";
import { IssueLabels, Label } from "../../../Modals/TaskModal";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
interface Props {
  title: string;
  id: number;
  type: string;
  index: number;
  description: string;
  sectionName: string;
}

const SectionIssue = ({ issue, index }: any) => {
  const [isIssueOpen, setIsIssueOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<IssueLabels[] | [] | Label[]>(
    issue.labels
  );
  return (
    <Draggable
      key={issue.id.toString()}
      draggableId={issue.id.toString()}
      index={index}
    >
      {(provided) => (
        <div
          className="p-2 rounded-md bg-white flex flex-col space-y-4 cursor-pointer mt-2"
          key={issue.id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className="text-md cursor-pointer"
            onClick={() => setIsIssueOpen(!isIssueOpen)}
          >
            {issue.title}
          </div>
          <div className="flex flex-wrap gap-2">
            {issue?.labels?.map((label: Label, index: number) => (
              <div
                className="bg-gray-100 py-1 px-2 rounded-sm font-medium text-gray-600 text-sm"
                key={index}
              >
                {label.name}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              <span
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: `${colorFetcher(issue.type)}`,
                }}
              ></span>

              <span className="text-xs font-extralight text-gray-800">
                NEW-{issue.id}
              </span>
            </div>

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
          {isIssueOpen && (
            <IssueModal
              isOpen={isIssueOpen}
              setIsOpen={setIsIssueOpen}
              sectionName={issue.sectionName}
              task={issue}
              setLabels={setLabels}
              labels={labels}
              type="scrumSection"
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default SectionIssue;

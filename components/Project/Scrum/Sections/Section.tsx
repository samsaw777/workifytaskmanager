import React from "react";
import SectionIssue from "./SectionIssue";
import { Droppable } from "react-beautiful-dnd";
import { ProjectState } from "../../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import KanbanTask from "../../Kanban/KanbanTask";

interface Issue {
  id: number;
  type: string;
  issue: string;
  username: string;
  userId: string;
  profille: string;
  position: number;
  sectionId: number;
  sprintId: number;
}

interface Props {
  id: number;
  title: string;
  issues: Issue[];
  type: string;
}

const Section = ({ id, title, issues, type }: Props) => {
  const { loggedInUser } = ProjectState();
  const createTask = async (sectionId: number) => {
    console.log("Starting");
    await axios
      .post(`${urlFetcher()}/api/kanban/createtask`, {
        sectionId,
        title: "First Task",
        userId: loggedInUser.id,
        username: loggedInUser.username,
        profile: loggedInUser.profile,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <div
      key={id}
      className="h-[100%] flex-none bg-gray-100 w-[350px] rounded-md"
    >
      <div className="p-2 px-4 text-gray-500">{title}</div>
      <Droppable key="{id.toString()}" droppableId={id.toString()}>
        {(provided) => (
          <div
            className="flex flex-col h-[100%] space-y-2 px-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {type == "SCRUM" ? (
              <div>
                {issues.map((issue: Issue, index: number) => (
                  <div key={index}>
                    <SectionIssue
                      id={issue.id}
                      type={issue.type}
                      issue={issue.issue}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {issues.map((issue: any, index: number) => (
                  <div key={index}>
                    <KanbanTask issue={issue} index={index} />
                    {/* <div
                      className=" cursor-pointer"
                      onClick={() => createTask(id)}
                    >
                      Create Task
                    </div> */}
                  </div>
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Section;

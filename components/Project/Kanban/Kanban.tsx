import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import { ProjectState } from "../../../Context/ProjectContext";
import Section from "../Scrum/Sections/Section";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Kanban = () => {
  const {
    project: { board },
  } = ProjectState();
  const [sections, setSections] = useState<{}[]>([]);
  console.log(sections);

  const fetchKanbanSections = async () => {
    try {
      await axios
        .post(`${urlFetcher()}/api/section/getsection`, {
          boardId: board[1].id,
          type: "KANBAN",
        })
        .then((res) => {
          setSections(res.data);
        });
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKanbanSections();
  }, []);

  const createSection = async () => {
    try {
      await axios
        .post(`${urlFetcher()}/api/section/createsection`, {
          boardId: board[1].id,
        })
        .then((res) => {
          setSections([...sections, res.data]);
        });
    } catch (error: any) {
      console.error(error);
    }
  };

  const onDragEnd = () => {};

  return (
    <div className="px-2 mx-2 w-full">
      <div
        onClick={() => createSection()}
        className="p-2 bg-blue-500 text-white w-fit rounded-md cursor-pointer"
      >
        Create Section
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-5 w-full overflow-x-auto mt-2 h-[75vh] pb-2 section-title">
          {sections.map((section: any, index: number) => {
            return (
              <div key={index}>
                <Section
                  id={section.id}
                  title={section.title}
                  issues={
                    board[1].type == "KANBAN" ? section.tasks : section.issues
                  }
                  boardId={section.boardId}
                  type="KANBAN"
                />
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;

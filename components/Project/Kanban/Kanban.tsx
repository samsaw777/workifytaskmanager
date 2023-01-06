import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { ProjectState } from "../../../Context/ProjectContext";
import KanbanSection from "./KanbanSection";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Kanban = () => {
  const {
    project: { board },

    sections,
    setSections,
  } = ProjectState();
  // const [sections, setSections] = useState<{}[]>([]);

  const fetchKanbanSections = async () => {
    try {
      setSections([]);
      await axios
        .post(`${urlFetcher()}/api/section/getsection`, {
          boardId: board[1].id,
          type: "KANBAN",
        })
        .then((res) => {
          setSections([...res.data]);
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
                <KanbanSection
                  id={section.id}
                  title={section.title}
                  tasks={section.tasks}
                  boardId={section.boardId}
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

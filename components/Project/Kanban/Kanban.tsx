import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { ProjectState } from "../../../Context/ProjectContext";
import KanbanSection from "./KanbanSection";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import io, { Socket } from "socket.io-client";

let socket: Socket;

const Kanban = () => {
  const {
    project: { id, board },
    members,
    sections,
    setSections,
  } = ProjectState();
  // const [sections, setSections] = useState<{}[]>([]);

  const socketInit = async () => {
    // await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  const fetchKanbanSections = async () => {
    try {
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
    socketInit();
  }, []);

  const createSection = async () => {
    const notification = Toast.loading("Creating Section!");

    try {
      await axios
        .post(`${urlFetcher()}/api/section/createsection`, {
          boardId: board[1].id,
        })
        .then((res) => {
          socket.emit("sectionCreated", {
            ProjectId: id,
            members,
            kanbansection: res.data,
            type: "createsection",
            dashboardsection: "kanban",
          });
          Toast.success("Section Created!", {
            id: notification,
          });
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  const onDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let newData: any = JSON.parse(JSON.stringify(sections));
    //find the source and destination column index.
    const sourceColIndex = newData.findIndex(
      (section: any) => section.id === parseInt(source.droppableId)
    );
    const destinationColIndex = newData.findIndex(
      (e: any) => e.id === parseInt(destination.droppableId)
    );

    //get the sourceSection and the destinationSection.
    const sourceCol = newData[sourceColIndex];
    const destinationCol = newData[destinationColIndex];

    //get the of both source and destination.
    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    //source and destination tasks.
    const sourceTasks =
      sourceCol?.tasks?.length > 0 ? [...sourceCol?.tasks] : [];
    const destinationTasks =
      destinationCol?.tasks?.length > 0 ? [...destinationCol?.tasks] : [];

    //Logic
    if (parseInt(source.droppableId) !== parseInt(destination.droppableId)) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      newData[sourceColIndex].tasks = sourceTasks;
      newData[destinationColIndex].tasks = destinationTasks;
      setSections(newData);
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      newData[destinationColIndex].tasks = destinationTasks;
      setSections(newData);
    }

    const notification = Toast.loading("Changing Position!");

    await axios
      .post(`${urlFetcher()}/api/kanban/task/updatetaskposition`, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      })
      .then((res) => {
        Toast.success("Position Changed!", {
          id: notification,
        });
      })
      .catch((error) => {
        Toast.error(error, {
          id: notification,
        });
      });
    socket.emit("issueDraggedInSprint", {
      ProjectId: id,
      members,
      sprint: newData,
      type: "taskDraged",
      section: "kanban",
    });
  };

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
                  index={index}
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

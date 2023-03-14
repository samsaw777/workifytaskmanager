import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { ProjectState } from "../../../Context/ProjectContext";
import KanbanSection from "./KanbanSection";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

let socket: Socket;

const Kanban = () => {
  const {
    project: { id, board },
    members,
    sections,
    setSections,
    localSections,
    setLocalSections,
  } = ProjectState();
  // const [sections, setSections] = useState<{}[]>([]);

  const [filteredString, setFilteredString] = useState<string[]>([]);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  const [loading, setLoading] = useState<boolean>(false);

  const fetchKanbanSections = async () => {
    try {
      setLoading(true);
      await axios
        .post(`${urlFetcher()}/api/section/getsection`, {
          boardId: board[1].id,
          type: "KANBAN",
        })
        .then((res) => {
          setLoading(false);
          setSections([...res.data]);
          setLocalSections([...res.data]);
        });
    } catch (error: any) {
      setLoading(false);
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
    let localNewData = JSON.parse(JSON.stringify(localSections));
    //find the source and destination column index.
    const sourceColIndex = newData.findIndex(
      (section: any) => section.id === parseInt(source.droppableId)
    );
    const destinationColIndex = newData.findIndex(
      (e: any) => e.id === parseInt(destination.droppableId)
    );

    const localSourceColIndex = localNewData.findIndex(
      (section: any) => section.id === parseInt(source.droppableId)
    );
    const localDestinationColIndex = localNewData.findIndex(
      (e: any) => e.id === parseInt(destination.droppableId)
    );

    //get the sourceSection and the destinationSection.
    const sourceCol = newData[sourceColIndex];
    const destinationCol = newData[destinationColIndex];

    //get the of both source and destination.
    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const localSourceCol = localNewData[localSourceColIndex];
    const localDestinationCol = localNewData[localDestinationColIndex];

    //get the of both source and destination.
    const localSourceSectionId = localSourceCol.id;
    const localDestinationSectionId = localDestinationCol.id;

    //source and destination tasks.
    const sourceTasks =
      sourceCol?.tasks?.length > 0 ? [...sourceCol?.tasks] : [];
    const destinationTasks =
      destinationCol?.tasks?.length > 0 ? [...destinationCol?.tasks] : [];

    const localSourceTasks =
      localSourceCol?.tasks?.length > 0 ? [...localSourceCol?.tasks] : [];
    const localDestinationTasks =
      localDestinationCol?.tasks?.length > 0
        ? [...localDestinationCol?.tasks]
        : [];

    //Logic
    if (parseInt(source.droppableId) !== parseInt(destination.droppableId)) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      newData[sourceColIndex].tasks = sourceTasks;
      newData[destinationColIndex].tasks = destinationTasks;

      const [localremoved] = localSourceTasks.splice(source.index, 1);
      localDestinationTasks.splice(destination.index, 0, localremoved);
      localNewData[localSourceColIndex].tasks = localSourceTasks;
      localNewData[localDestinationColIndex].tasks = localDestinationTasks;

      setLocalSections(localNewData);
      setSections(newData);
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      newData[destinationColIndex].tasks = destinationTasks;

      const [localremoved] = localDestinationTasks.splice(source.index, 1);
      localDestinationTasks.splice(destination.index, 0, localremoved);
      localNewData[localDestinationColIndex].tasks = localDestinationTasks;
      setSections(newData);
      setLocalSections(localNewData);
    }

    const notification = Toast.loading("Changing Position!");

    await axios
      .post(`${urlFetcher()}/api/kanban/task/updatetaskposition`, {
        resourceList: localSourceTasks,
        destinationList: localDestinationTasks,
        resourceSectionId: localSourceSectionId,
        destinationSectionId: localDestinationSectionId,
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

  const filterIssues = (sections: any) => {
    if (filteredString.length > 0) {
      let filteredArr = sections.map((sprint: any) => ({
        ...sprint,
        tasks: sprint.tasks.filter((issue: any) =>
          filteredString.includes(issue.assignedTo)
        ),
      }));

      setSections([...filteredArr]);
    } else {
      setSections([...sections]);
    }
  };

  const checkFilteredSearch = (userId: string) => {
    if (filteredString.includes(userId)) {
      const newFilteredString = filteredString.filter(
        (string: string) => string !== userId
      );
      setFilteredString(newFilteredString);
    } else {
      setFilteredString([...filteredString, userId]);
    }
  };

  useEffect(() => {
    filterIssues(localSections);
  }, [filteredString]);

  return (
    <>
      {loading ? (
        <div className="w-full h-[70vh] flex items-center justify-center">
          <span>Loading ...</span>
        </div>
      ) : (
        <div className="px-2 mx-2 w-full">
          <div className="flex space-x-2">
            <div
              onClick={() => createSection()}
              className="p-2 bg-blue-500 text-white w-fit rounded-md cursor-pointer"
            >
              Create Section
            </div>
            <div className="flex items-center">
              <div className="flex flex-row space-x-[-10%] px-2">
                {members.map((member: any, index: number) => {
                  return member.profileImage ? (
                    <div
                      key={index}
                      onClick={() => checkFilteredSearch(member.userId)}
                      className={`scrum_image  w-8 cursor-pointer h-8 rounded-full items-center flex overflow-hidden ${
                        filteredString.includes(member.userId) &&
                        "border-[3px] border-blue-500"
                      }`}
                    >
                      <Image
                        src={member.profileImage}
                        width={90}
                        height={90}
                        alt="UserProfile"
                      />
                    </div>
                  ) : (
                    <FaUserCircle className="text-4xl text-violet-400 cursor-pointer" />
                  );
                })}
              </div>
              <span
                className="m-0 hover:bg-gray-200 rounded-md text-sm py-1 px-3 cursor-pointer"
                onClick={() => setFilteredString([])}
              >
                Clear Filter
              </span>
            </div>
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
      )}
    </>
  );
};

export default Kanban;

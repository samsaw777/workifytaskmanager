import React, { useEffect } from "react";
import { ProjectState } from "../../../Context/ProjectContext";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Section from "./Sections/Section";
import Toast from "react-hot-toast";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { AiOutlinePlus } from "react-icons/ai";

let socket: Socket;

const ScrumBoard = () => {
  const {
    scrumSections,
    setScrumSections,
    project: { board, id },
    members,
  } = ProjectState();

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };
  const fetchSections = async () => {
    try {
      await axios
        .post(`${urlFetcher()}/api/section/getsection`, {
          boardId: board[0].id,
          type: "SCRUM",
        })
        .then((res) => {
          setScrumSections([...res.data]);
        });
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSections();
    socketInit();
  }, []);

  const onDragEnd = async ({ source, destination }: DropResult) => {
    let notification: any;

    try {
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      notification = Toast.loading("Changing Position");

      let sectionData = JSON.parse(JSON.stringify(scrumSections));

      //Find the source and destination column index.
      const sourceColIndex = sectionData.findIndex(
        (section: any) => section.id === parseInt(source.droppableId)
      );

      const destinationColIndex = sectionData.findIndex(
        (section: any) => section.id === parseInt(destination.droppableId)
      );

      //Get the sourceSection and the destinationSection.
      const sourceCol = sectionData[sourceColIndex];
      const destinationCol = sectionData[destinationColIndex];

      const sourceSectionId = sourceCol.id;
      const destinationSectionId = destinationCol.id;

      //Get the source and destination issues.
      const sourceIssues =
        sourceCol?.issues?.length > 0 ? [...sourceCol?.issues] : [];

      const destinationIssues =
        destinationCol?.issues?.length > 0 ? [...destinationCol?.issues] : [];

      //Logic Building.
      if (parseInt(source.droppableId) !== parseInt(destination.droppableId)) {
        const [removed] = sourceIssues.splice(source.index, 1);
        destinationIssues.splice(destination.index, 0, removed);
        sectionData[sourceColIndex].issues = sourceIssues;
        sectionData[destinationColIndex].issues = destinationIssues;

        setScrumSections(sectionData);
      } else {
        const [removed] = destinationIssues.splice(source.index, 1);
        destinationIssues.splice(destination.index, 0, removed);
        sectionData[destinationColIndex].issues = destinationIssues;
        setScrumSections(sectionData);
      }

      await axios
        .post(`${urlFetcher()}/api/section/updatesectionissues`, {
          resourceList: sourceIssues,
          destinationList: destinationIssues,
          sectionResourceId: sourceSectionId,
          sectionDestinationId: destinationSectionId,
          sectionResourceName: sourceCol.title,
          sectionDestinationName: destinationCol.title,
        })
        .then((res) => {
          Toast.success("Position Changed!", {
            id: notification,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      socket.emit("issueDraggedInSprint", {
        ProjectId: id,
        members,
        sprint: sectionData,
        type: "dragged",
        section: "scrumboard",
      });
    } catch (error: any) {
      console.log(Error);
    }
  };

  const createScrumSection = async () => {
    const notification = Toast.loading("Creating Section!");
    try {
      await axios
        .post(`${urlFetcher()}/api/section/createsection`, {
          title: "",
          boardId: board[0].id,
        })
        .then((response) => {
          Toast.success("Section Created", { id: notification });
          setScrumSections([...scrumSections, response.data]);
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <div className="px-2 overflow-x-auto w-full pb-1 section-title">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-2 mt-2 h-[85vh] pb-2 w-full">
          {scrumSections.map(
            ({ id, title, issues, boardId }: any, index: number) => {
              return (
                <div
                  key={index}
                  className="h-full flex-non w-[350px] rounded-md"
                >
                  <Section
                    id={id}
                    title={title}
                    issues={issues}
                    boardId={boardId}
                  />
                </div>
              );
            }
          )}
          <div className="h-full flex-none w-10 rounded-md">
            <AiOutlinePlus
              className="bg-gray-200 p-1 rounded-sm cursor-pointer  w-7 h-7"
              onClick={() => createScrumSection()}
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ScrumBoard;

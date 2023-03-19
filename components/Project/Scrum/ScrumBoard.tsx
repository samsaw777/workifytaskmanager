import React, { useEffect, useState } from "react";
import { ProjectState } from "../../../Context/ProjectContext";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Section from "./Sections/Section";
import Toast from "react-hot-toast";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { AiOutlinePlus } from "react-icons/ai";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import SectionLoading from "../../Loading/SectionLoading";

let socket: Socket;

const ScrumBoard = () => {
  const {
    scrumSections,
    setScrumSections,
    project: { board, id },
    members,
    localScrumSections,
    setLocalScrumSections,
  } = ProjectState();
  const [filteredString, setFilteredString] = useState<string[]>([]);
  console.log(scrumSections);
  const [loading, setLoading] = useState<boolean>(false);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };
  const fetchSections = async () => {
    setLoading(true);
    try {
      await axios
        .post(`${urlFetcher()}/api/section/getsection`, {
          boardId: board[0].id,
          type: "SCRUM",
        })
        .then((res) => {
          setScrumSections([...res.data]);
          setLoading(false);
          setLocalScrumSections([...res.data]);
        });
    } catch (error: any) {
      console.error(error);
      setLoading(false);
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
      let localsectionData = JSON.parse(JSON.stringify(localScrumSections));

      //Find the source and destination column index.
      const sourceColIndex = sectionData.findIndex(
        (section: any) => section.id === parseInt(source.droppableId)
      );

      const destinationColIndex = sectionData.findIndex(
        (section: any) => section.id === parseInt(destination.droppableId)
      );
      const localSourceColIndex = localsectionData.findIndex(
        (section: any) => section.id === parseInt(source.droppableId)
      );

      const localDestinationColIndex = localsectionData.findIndex(
        (section: any) => section.id === parseInt(destination.droppableId)
      );

      //Get the sourceSection and the destinationSection.
      const sourceCol = sectionData[sourceColIndex];
      const destinationCol = sectionData[destinationColIndex];

      const sourceSectionId = sourceCol.id;
      const destinationSectionId = destinationCol.id;

      const localSourceCol = localsectionData[localSourceColIndex];
      const localDestinationCol = localsectionData[localDestinationColIndex];

      const localSourceSectionId = localSourceCol.id;
      const localDestinationSectionId = localDestinationCol.id;

      //Get the source and destination issues.
      const sourceIssues =
        sourceCol?.issues?.length > 0 ? [...sourceCol?.issues] : [];

      const destinationIssues =
        destinationCol?.issues?.length > 0 ? [...destinationCol?.issues] : [];

      const localSourceIssues =
        localSourceCol?.issues?.length > 0 ? [...localSourceCol?.issues] : [];

      const localDestinationIssues =
        localDestinationCol?.issues?.length > 0
          ? [...localDestinationCol?.issues]
          : [];

      //Logic Building.
      if (parseInt(source.droppableId) !== parseInt(destination.droppableId)) {
        const [removed] = sourceIssues.splice(source.index, 1);
        destinationIssues.splice(destination.index, 0, removed);
        sectionData[sourceColIndex].issues = sourceIssues;
        sectionData[destinationColIndex].issues = destinationIssues;

        const [localremoved] = localSourceIssues.splice(source.index, 1);
        localDestinationIssues.splice(destination.index, 0, localremoved);
        localsectionData[localSourceColIndex].issues = localSourceIssues;
        localsectionData[localDestinationColIndex].issues =
          localDestinationIssues;

        setScrumSections(sectionData);
        setLocalScrumSections(localsectionData);
      } else {
        const [removed] = destinationIssues.splice(source.index, 1);
        destinationIssues.splice(destination.index, 0, removed);
        sectionData[destinationColIndex].issues = destinationIssues;

        const [localremoved] = localDestinationIssues.splice(source.index, 1);
        localDestinationIssues.splice(destination.index, 0, localremoved);
        localsectionData[localDestinationColIndex].issues =
          localDestinationIssues;
        setScrumSections(sectionData);
        setLocalScrumSections(localsectionData);
      }

      await axios
        .post(`${urlFetcher()}/api/section/updatesectionissues`, {
          resourceList: localSourceIssues,
          destinationList: localDestinationIssues,
          sectionResourceId: localSourceSectionId,
          sectionDestinationId: localDestinationSectionId,
          sectionResourceName: localSourceCol.title,
          sectionDestinationName: localDestinationCol.title,
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

  const filterIssues = (sections: any) => {
    if (filteredString.length > 0) {
      let filteredArr = sections.map((sprint: any) => ({
        ...sprint,
        issues: sprint.issues.filter((issue: any) =>
          filteredString.includes(issue.assignedTo)
        ),
      }));

      setScrumSections([...filteredArr]);
    } else {
      setScrumSections([...sections]);
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

  useEffect(() => {
    filterIssues(localScrumSections);
  }, [filteredString]);

  return (
    <>
      {loading ? (
        <SectionLoading />
      ) : (
        <>
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

          <div className="px-2 overflow-x-auto w-full pb-1 section-title">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex space-x-2 mt-2 h-[80vh] pb-2 w-full">
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
        </>
      )}
    </>
  );
};

export default ScrumBoard;

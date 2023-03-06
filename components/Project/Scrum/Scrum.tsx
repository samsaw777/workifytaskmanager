import React, { useState, useEffect } from "react";
import IssueModal from "../../Modals/IssueModal";
import { ProjectState } from "../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Sprint from "./Sprints/Sprint";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

let socket: Socket;

const Scrum = () => {
  const {
    project: { id, board },
    sprints,
    setSprints,
    members,
  } = ProjectState();

  // console.log(members);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  const fetchSprints = async () => {
    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/sprint/getsprint`, {
          boardId: board[0].id,
        })
        .then((res) => {
          setSprints(res.data);
          setLocalSprints(res.data);
        });
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSprints();
    socketInit();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const [updateIssueDetails, setUpdateIssueDetails] = useState<{
    type: string;
    id: number;
    title: string;
    sprintId: number;
    index: number;
    description: string;
  }>({
    type: "Story",
    id: 0,
    title: "",
    sprintId: 0,
    index: -1,
    description: "",
  });

  const [updateSprintDetails, setUpdateSprintDetails] = useState<{
    sprintId: number;
    index: number;
    sprintName: string;
    startDate: Date;
    endDate: Date;
  }>({
    sprintId: 0,
    index: -1,
    sprintName: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [issueCheck, setIssueCheck] = useState<string>("");
  const [localSprints, setLocalSprints] = useState<any>([]);

  const [filteredString, setFilteredString] = useState<string[]>([]);
  const [sprintDetails, setSprintDetails] = useState<{
    id: number;
    sprintName: string;
    startDate: Date;
    endDate: Date;
  }>({
    id: 0,
    sprintName: "",
    startDate: new Date(),
    endDate: new Date(),
  });

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

      notification = Toast.loading("Changing Position!");

      // Create a new sprint array to update.
      let newSprintArray = JSON.parse(JSON.stringify(sprints));

      //Find the source and destination index.
      const sourceColIndex = newSprintArray.findIndex(
        (sprint: any) => sprint.id == parseInt(source.droppableId)
      );
      const destinationColIndex = newSprintArray.findIndex(
        (sprint: any) => sprint.id == parseInt(destination.droppableId)
      );

      //Get soruce and destination sprints.
      const sourceSprint = newSprintArray[sourceColIndex];
      const destinationSprint = newSprintArray[destinationColIndex];

      const sourceSprintId = sourceSprint.id;
      const destinationSprintId = destinationSprint.id;

      //Get the source and destination issues.
      const sourceIssues =
        sourceSprint?.issues?.length > 0 ? [...sourceSprint?.issues] : [];
      const destinationIssues =
        destinationSprint?.issues?.length > 0
          ? [...destinationSprint?.issues]
          : [];

      //Logic to change the issues between sprints.
      if (parseInt(source.droppableId) !== parseInt(destination.droppableId)) {
        const [removed] = sourceIssues.splice(source.index, 1);
        destinationIssues.splice(destination.index, 0, removed);
        newSprintArray[sourceColIndex].issues = sourceIssues;
        newSprintArray[destinationColIndex].issues = destinationIssues;
        setSprints(newSprintArray);
      } else {
        const [removed] = destinationIssues.splice(source.index, 1);
        destinationIssues.splice(destination.index, 0, removed);
        newSprintArray[destinationColIndex].issues = destinationIssues;
        setSprints(newSprintArray);
      }

      await axios
        .post(`${urlFetcher()}/api/scrum/issue/updatebacklogissue`, {
          resourceList: sourceIssues,
          destinationList: destinationIssues,
          sprintResourceId: sourceSprintId,
          sprintDestinationId: destinationSprintId,
          sprintResourceName: sourceSprint.sprintName,
          sprintDestinationName: destinationSprint.sprintName,
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
        sprint: newSprintArray,
        type: "issuedrag",
        section: "backlog",
      });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  const filterIssues = (sprints: any) => {
    if (filteredString.length > 0) {
      let filteredArr = sprints.map((sprint: any) => ({
        ...sprint,
        issues: sprint.issues.filter((issue: any) =>
          filteredString.includes(issue.assignedTo)
        ),
      }));

      setSprints([...filteredArr]);
    } else {
      setSprints([...sprints]);
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
    filterIssues(localSprints);
  }, [filteredString]);

  return (
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
      <DragDropContext onDragEnd={onDragEnd} key="fdfd">
        <div className="w-full p-2 flex flex-col space-y-3">
          {sprints.map((sprint: any, index: number) => {
            return (
              <div key={index}>
                <Sprint
                  sprint={sprint}
                  index={index}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  setUpdateIssueDetails={setUpdateIssueDetails}
                  setSprintDetails={setSprintDetails}
                  socket={socket}
                  setUpdateSprintDetails={setUpdateSprintDetails}
                  updateSprintDetails={updateSprintDetails}
                />
              </div>
            );
          })}

          {isOpen && (
            <IssueModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setUpdateIssueDetails={setUpdateIssueDetails}
              updateIssueDetails={updateIssueDetails}
              setIssueCheck={setIssueCheck}
              setSprintDetails={setSprintDetails}
              sprintDetails={sprintDetails}
              socket={socket}
            />
          )}
        </div>
      </DragDropContext>
    </>
  );
};

export default Scrum;

/*

if (!destination) return;

    //Copy the sections.
    let copySectionData = JSON.parse(JSON.stringify(board[0].sections));

    //Find the source and destination column index.
    const sourceColIndex = copySectionData.findIndex(
      (section: any) => section.id === parseInt(source.droppableId)
    );

    const destinationColIndex = copySectionData.findIndex(
      (e: any) => e.id === parseInt(destination.droppableId)
    );

    //Get the sourceSection and destinationSection.
    const sourceCol = copySectionData[sourceColIndex];
    const destinationCol = copySectionData[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    //Source and Destination Issues.
    const sourceIssues =
      sourceCol?.issues?.length > 0 ? [...sourceCol?.issues] : [];

    const destinationIssues =
      destinationCol?.issues?.length > 0 ? [...destinationCol?.issues] : [];

    //Logic for this function.
    //1. check if the source and destination is different or not.
    if (parseInt(source.droppableId) !== parseInt(destination.droppableId)) {
      const [removedIssue] = sourceIssues.splice(source.index, 1);
      destinationIssues.splice(destination.index, 0, removedIssue);
      copySectionData[sourceColIndex].issues = sourceIssues;
      copySectionData[destinationColIndex].issues = destinationIssues;
      setIssues(copySectionData);
    } else {
      const [removedIssue] = destinationIssues.splice(source.index, 1);
      destinationIssues.splice(destination.index, 0, removedIssue);
      copySectionData[destinationColIndex].tasks = destinationIssues;
      setIssues(copySectionData);
    }

    */

//Second Logic for onDragEnd.
/**      let newIssuesList = [];

      const notEqual = JSON.parse(
        JSON.stringify(
          issues.filter(
            (issue: any) =>
              issue.sprintName != source.droppableId || destination.droppableId
          )
        )
      );

      console.log(notEqual);
      const sourceIssues = JSON.parse(
        JSON.stringify(
          issues.filter((issue: any) => issue.sprintName == source.droppableId)
        )
      );
      const destinationIssues = JSON.parse(
        JSON.stringify(
          issues.filter(
            (issue: any) => issue.sprintName == destination.droppableId
          )
        )
      );
      if (source.droppableId == destination.droppableId) {
        const [removedIssue] = sourceIssues.splice(source.index, 1);
        sourceIssues.splice(destination.index, 0, removedIssue);
        newIssuesList = [...notEqual, ...sourceIssues, ...destinationIssues];
        setIssues(newIssuesList);
      } else {
        let [removed] = sourceIssues.splice(source.index, 1);
        removed.sprintName = destination.droppableId;
        destinationIssues.splice(destination.index, 0, removed);
        newIssuesList = [...notEqual, ...sourceIssues, ...destinationIssues];
        setIssues(newIssuesList);
      }
      */

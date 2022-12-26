import React, { useState, useEffect } from "react";
import IssueModal from "../../Modals/IssueModal";
import SprintModal from "../../Modals/SprintModal";
import { ProjectState } from "../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Backlog from "./Backloq/Backlog";
import Sprint from "./Sprints/Sprint";

interface SprintInterface {
  sprintName: string;
  boardId: number;
}

const Scrum = () => {
  const {
    issues,
    setIssues,
    project: { id, board },
    sprints,
  } = ProjectState();

  console.log(board);

  const fetchIssues = async () => {
    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/issue/getissues`, {
          id,
        })
        .then((res) => {
          setIssues(res.data);
        });
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchIssues();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [updateIssueDetails, setUpdateIssueDetails] = useState<{
    type: string;
    id: number;
    issue: string;
    index: number;
  }>({ type: "Story", id: 0, issue: "", index: 0 });
  const [issueCheck, setIssueCheck] = useState<string>("");
  const [index, setIndex] = useState<number>(-1);

  const onDragEnd = async ({ source, destination }: DropResult) => {
    console.log(source, destination);
    // const notification = Toast.loading("Changing Position!");
    try {
      if (!destination) return;
      let newIssuesList = [];

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
      // await axios
      //   .post(`${urlFetcher()}/api/scrum/issue/updatebacklogissue`, {
      //     resourceList: sourceIssues,
      //     destinationList: destinationIssues,
      //     sprintResourceId: source.droppableId,
      //     sprintDestinationId: destination.droppableId,
      //   })
      //   .then((res) => {
      //     Toast.success("Position Changed!", {
      //       id: notification,
      //     });
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    } catch (error: any) {
      // Toast.error(error.message, {
      //   id: notification,
      // });
      console.log(error.message);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-ful p-2 flex flex-col space-y-3">
        {sprints.map((sprint: any, index: number) => {
          return (
            <Sprint
              sprint={sprint}
              index={index}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setUpdateIssueDetails={setUpdateIssueDetails}
              setIssueCheck={setIssueCheck}
              setIndex={setIndex}
            />
          );
        })}
        <Backlog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setUpdateIssueDetails={setUpdateIssueDetails}
          setIssueCheck={setIssueCheck}
          setIndex={setIndex}
        />
        <IssueModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setUpdateIssueDetails={setUpdateIssueDetails}
          updateIssueDetails={updateIssueDetails}
          check={issueCheck}
          setIssueCheck={setIssueCheck}
          index={index}
        />
        {/* <SprintModal /> */}
      </div>
    </DragDropContext>
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

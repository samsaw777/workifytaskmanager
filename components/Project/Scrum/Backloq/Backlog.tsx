import React, { useState, useEffect } from "react";
import { RiArrowDropDownLine, RiTestTubeLine } from "react-icons/Ri";
import { AiOutlinePlus } from "react-icons/ai";
import IssueModal from "../../../Modals/IssueModal";
import { ProjectState } from "../../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import Issue from "../Backloq/Issue";

const Backlog = () => {
  const {
    issues,
    setIssues,
    project: { id, board },
  } = ProjectState();

  const fetchIssues = async () => {
    console.log(issues);
    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/issue/getissues`, {
          id,
          getType: "Project",
        })
        .then((res) => {
          console.log(res.data);
          setIssues(res.data);
        });
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchIssues();
  }, []);

  const [openBacklog, setOpenBacklog] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [updateIssueDetails, setUpdateIssueDetails] = useState<{
    type: string;
    id: number;
    issue: string;
    index: number;
  }>({ type: "Story", id: 0, issue: "", index: 0 });

  const onDragEnd = async ({ source, destination }: DropResult) => {
    const notification = Toast.loading("Changing Position!");
    try {
      if (!destination) return;

      let newIssuesList = [];
      const sourceIssues = JSON.parse(
        JSON.stringify(
          issues.filter((issue: any) => issue.sprintId == source.droppableId)
        )
      );

      const destinationIssues = JSON.parse(
        JSON.stringify(
          issues.filter(
            (issue: any) => issue.sprintId == destination.droppableId
          )
        )
      );

      if (parseInt(source.droppableId) == parseInt(destination.droppableId)) {
        const [removedIssue] = sourceIssues.splice(source.index, 1);
        sourceIssues.splice(destination.index, 0, removedIssue);
        newIssuesList = [...sourceIssues, ...destinationIssues];
        setIssues(newIssuesList);
      } else {
        let [removed] = sourceIssues.splice(source.index, 1);
        removed.sprintId = destination.droppableId;
        destinationIssues.splice(destination.index, 0, removed);
        newIssuesList = [...sourceIssues, ...destinationIssues];
        setIssues(newIssuesList);
      }

      await axios
        .post(`${urlFetcher()}/api/scrum/issue/updatebacklogissue`, {
          resourceList: sourceIssues,
          destinationList: destinationIssues,
          sprintResourceId: source.droppableId,
          sprintDestinationId: destination.droppableId,
        })
        .then((res) => {
          Toast.success("Position Changed!", {
            id: notification,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-ful p-2">
        <Droppable key="sprintOne" droppableId={"3".toString()}>
          {(provided) => (
            <div
              // className={`${openBacklog ? "block" : "hidden"}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              hello
              {[...issues.filter((issues: any) => issues.sprintId == 3)].map(
                (issue: any, index: number) => {
                  return (
                    <Issue
                      issue={issue}
                      index={index}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      setUpdateIssueDetails={setUpdateIssueDetails}
                    />
                  );
                }
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="flex flex-col space-y-2">
          <div className="w-full flex justify-between items-center">
            <div
              className="flex space-x-1 items-center cursor-pointer flex-1 px-3 py-1"
              onClick={() => setOpenBacklog(!openBacklog)}
            >
              <RiArrowDropDownLine
                className={`text-2xl ${
                  !openBacklog && "-rotate-90"
                } transition duration-150`}
              />
              <span>Backlog</span>
            </div>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200">
              create sprint
            </div>
          </div>
          <Droppable key="issueKey" droppableId={board[0].id.toString()}>
            {(provided) => (
              <div
                className={`${openBacklog ? "block" : "hidden"}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {issues.length > 0 ? (
                  <div>
                    {[
                      ...issues.filter(
                        (issues: any) => issues.sprintId == board[0].id
                      ),
                    ].map((issue, index: number) => {
                      return (
                        <Issue
                          issue={issue}
                          index={index}
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                          setUpdateIssueDetails={setUpdateIssueDetails}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </div>
                ) : (
                  <div className="w-full flex h-10 border-2 text-blue-600 border-dashed border-blue-100 text-xs justify-center items-center">
                    Your backlog is empty..
                  </div>
                )}
                <div
                  className="flex space-x-2 items-center text-sm mt-1  p-2 group hover:bg-gray-200 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <AiOutlinePlus className="" />
                  <span>Create Issue</span>
                </div>
              </div>
            )}
          </Droppable>
        </div>
        <IssueModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setUpdateIssueDetails={setUpdateIssueDetails}
          updateIssueDetails={updateIssueDetails}
        />
      </div>
    </DragDropContext>
  );
};

export default Backlog;

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

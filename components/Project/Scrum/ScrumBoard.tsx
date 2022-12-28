import React, { useEffect } from "react";
import { ProjectState } from "../../../Context/ProjectContext";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Section from "./Sections/Section";
import Toast from "react-hot-toast";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import axios from "axios";

const ScrumBoard = () => {
  const {
    sections,
    setSections,
    project: { board },
  } = ProjectState();

  const fetchSprints = async () => {
    try {
      await axios
        .post(`${urlFetcher()}/api/section/getsection`, {
          boardId: board[0].id,
        })
        .then((res) => {
          setSections(res.data);
        });
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSprints();
  }, []);

  const onDragEnd = async ({ source, destination }: DropResult) => {
    const notification = Toast.loading("Changing Position");
    try {
      if (!destination) return;
      let sectionData = JSON.parse(JSON.stringify(sections));

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

        setSections(sectionData);
      } else {
        const [removed] = destinationIssues.splice(source.index, 1);
        destinationIssues.splice(destination.index, 0, removed);
        sectionData[destinationColIndex].issues = destinationIssues;
        setSections(sectionData);
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
    } catch (error: any) {
      console.log(Error);
    }
  };

  return (
    <div className="px-2">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-5 w-full overflow-x-auto mt-2 h-[85vh] pb-2">
          {sections.map(({ id, title, issues }: any, index: number) => {
            return (
              <div key={index}>
                <Section id={id} title={title} issues={issues} />
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ScrumBoard;

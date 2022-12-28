import React from "react";
import { ProjectState } from "../../../Context/ProjectContext";

import Section from "./Sections/Section";

const ScrumBoard = () => {
  const { project } = ProjectState();
  console.log(project.board[0].sections);
  return (
    <div className="px-2">
      <div className="flex space-x-5 w-full overflow-x-auto mt-2 h-[85vh] pb-2">
        {project.board[0].sections.map(
          ({ id, title, issues }: any, index: number) => {
            return <Section id={id} title={title} issues={issues} />;
          }
        )}
      </div>
    </div>
  );
};

export default ScrumBoard;

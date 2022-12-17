import React from "react";
import { ProjectState } from "../../../Context/ProjectContext";

const ScrumBoard = () => {
  const { project } = ProjectState();
  return (
    <div className="px-2">
      <div className="flex space-x-5 w-full overflow-x-auto mt-2 h-[85vh] pb-2">
        {project.board[0].sections.map(({ title }: any, index: number) => {
          return (
            <div
              key={index}
              className="h-[100%] overflow-y-scroll flex-none bg-gray-100 w-[350px] rounded-md"
            >
              <div className="p-2 px-4 text-gray-500">{title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrumBoard;

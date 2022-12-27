import React from "react";
import { ProjectState } from "../../../Context/ProjectContext";
import { colorFetcher } from "../../../utils/Helper/colorFetcher";

const ScrumBoard = () => {
  const { project } = ProjectState();
  console.log(project.board[0].sections);
  return (
    <div className="px-2">
      <div className="flex space-x-5 w-full overflow-x-auto mt-2 h-[85vh] pb-2">
        {project.board[0].sections.map(
          ({ title, issues }: any, index: number) => {
            return (
              <div
                key={index}
                className="h-[100%] overflow-y-scroll flex-none bg-gray-100 w-[350px] rounded-md"
              >
                <div className="p-2 px-4 text-gray-500">{title}</div>
                <div
                  className="flex flex-col space-y-2 h-[90%] px-2 overflow-scroll
                "
                >
                  {issues.map((issue: any) => (
                    <div className="p-2 rounded-md bg-white flex flex-col space-y-4 cursor-pointer">
                      <div className="text-md">{issue.issue}</div>
                      <div className="flex space-x-2 items-center">
                        <span
                          className="w-3 h-3 rounded-sm"
                          style={{
                            backgroundColor: `${colorFetcher(issue.type)}`,
                          }}
                        ></span>
                        <span className="text-xs font-extralight text-gray-800">
                          NEW-{issue.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ScrumBoard;

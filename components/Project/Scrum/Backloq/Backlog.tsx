import React, { useState, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/Ri";
import { AiOutlinePlus } from "react-icons/ai";
import IssueModal from "../../../Modals/IssueModal";
import { ProjectState } from "../../../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";

import Issue from "../Backloq/Issue";

const Backlog = () => {
  const {
    issues,
    setIssues,
    project: { id },
  } = ProjectState();

  console.log(issues);

  const fetchIssues = async () => {
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

  return (
    <div className="w-ful p-2">
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
        <div className={`${openBacklog ? "block" : "hidden"}`}>
          {issues ? (
            <div>
              {issues.map((issue, index: number) => {
                return <Issue issue={issue} index={index} />;
              })}
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
      </div>
      <IssueModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Backlog;

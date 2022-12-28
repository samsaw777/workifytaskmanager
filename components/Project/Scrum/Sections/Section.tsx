import React from "react";
import SectionIssue from "./SectionIssue";

interface Issue {
  id: number;
  type: string;
  issue: string;
  username: string;
  userId: string;
  profille: string;
  position: number;
  sectionId: number;
  sprintId: number;
}

interface Props {
  id: number;
  title: string;
  issues: Issue[];
}

const Section = ({ id, title, issues }: Props) => {
  return (
    <div
      key={id}
      className="h-[100%] overflow-y-scroll flex-none bg-gray-100 w-[350px] rounded-md"
    >
      <div
        className="flex flex-col space-y-2 h-[90%] px-2 overflow-scroll
                "
      >
        <div className="p-2 px-4 text-gray-500">{title}</div>
        {issues.map((issue: Issue) => (
          <SectionIssue id={issue.id} type={issue.type} issue={issue.issue} />
        ))}
      </div>
    </div>
  );
};

export default Section;

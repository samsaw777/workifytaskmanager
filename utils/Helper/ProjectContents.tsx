import Members from "../../components/Project/addMembers";
import Scrum from "../../components/Project/Scrum/Scrum";
import ScrumBoard from "../../components/Project/Scrum/ScrumBoard";
import Kanban from "../../components/Project/Kanban/Kanban";
import Calendar from "../../components/Project/Calendar/Calendar";

interface Props {
  componentName: string;
  projectId: any;
}

export const ProjectContents = ({ componentName, projectId }: Props) => {
  switch (componentName) {
    case "Members":
      return <Members projectId={projectId} />;
    case "Scrum":
      return <>this is the scrum view.</>;
    case "Settings":
      return <>this is the settings stuff</>;
    case "scrumboard":
      return <ScrumBoard />;
    case "backlog":
      return <Scrum />;
    case "kboard":
      return <Kanban />;
    case "Calendar":
      return <Calendar />;
    default:
      return <Calendar />;
  }
};

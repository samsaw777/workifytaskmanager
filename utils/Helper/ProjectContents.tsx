import Members from "../../components/Project/addMembers";
import Backlog from "../../components/Project/Scrum/Backloq/Backlog";
import ScrumBoard from "../../components/Project/Scrum/ScrumBoard";

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
      return <Backlog />;
    default:
      return <>This is the default stuff</>;
  }
};

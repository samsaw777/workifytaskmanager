import Members from "../../components/Project/addMembers";

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
    default:
      return <>This is the default stuff</>;
  }
};

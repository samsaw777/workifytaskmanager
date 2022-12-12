import Members from "../../components/Project/addMembers";

interface Props {
  componentName: string;
  loggedInUser: any;
  projectId: any;
}

export const ProjectContents = ({
  componentName,
  loggedInUser,
  projectId,
}: Props) => {
  switch (componentName) {
    case "Members":
      return (
        <Members
          loggedInUser={{
            id: loggedInUser.id,
            email: loggedInUser.email,
            profileImage: loggedInUser.profile,
          }}
          projectId={projectId}
        />
      );
    case "Scrum":
      return <>this is the scrum view.</>;
    case "Settings":
      return <>this is the settings stuff</>;
    default:
      return <>This is the default stuff</>;
  }
};

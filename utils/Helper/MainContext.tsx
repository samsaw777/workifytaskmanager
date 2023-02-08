import Project from "../../components/Project/Project";
import Tasks from "../../components/Dashboard/Tasks";
type Props = {
  componentName: string;
};

export const showComponent = ({ componentName }: Props) => {
  switch (componentName) {
    case "Dashboard":
      return <div>This is dashboard</div>;
    case "Projects":
      return <Project />;
    case "Inbox":
      return <div>This is dashboard</div>;
    case "Tasks":
      return <Tasks />;
    case "Profile":
      return <div>This is dashboard</div>;
    case "Settings":
      return <div>This is dashboard</div>;
    default:
      return <div>This is dashboard</div>;
  }
};

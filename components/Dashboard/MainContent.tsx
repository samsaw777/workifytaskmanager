import React from "react";
import { showComponent } from "../../utils/Helper/MainContext";

interface LoggedinUser {
  email: string;
  id: string;
  username: string;
}
type Props = {
  loggedInUser: LoggedinUser;
  componentName: string;
};

const MainContent = ({ loggedInUser, componentName }: Props) => {
  return (
    <div className="h-[90vh] overflow-scroll p-5">
      {showComponent({ loggedInUser, componentName })}
    </div>
  );
};

export default MainContent;

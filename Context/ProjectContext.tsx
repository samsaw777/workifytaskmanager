import React, { createContext, useContext, useState } from "react";

interface User {
  loggedInUser: any;
  setLoggedInUser: React.Dispatch<any>;
}

const ProjectContext = createContext<User>({
  loggedInUser: {},
  setLoggedInUser() {},
});

const ProjectProvider = ({ children }: any) => {
  const [loggedInUser, setLoggedInUser] = useState<any>({});
  return (
    <ProjectContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const ProjectState = () => {
  return useContext(ProjectContext);
};

export default ProjectProvider;

import React, { useEffect, useState } from "react";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import axios from "axios";

const Dashboard = () => {
  const [loggedinUser, setLoggedInUser] = useState({});

  const getUser = async () => {
    await axios
      .get(`${urlFetcher()}/api/user/getuser`)
      .then((res) => {
        setLoggedInUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const createProject = async () => {
    await axios
      .post(`${urlFetcher()}/api/project/createproject`, {
        name: "Second Project",
        userId: "83fbe910-0dbf-47c7-a101-d827d280b6ba",
        isPrivate: true,
      })
      .then((res) => console.log(res.data))
      .catch((error: any) => {
        console.log(error.response.data.error);
      });
  };

  return (
    <div>
      This is dashboard view.
      <div
        className="p-2 bg-blue-300 rounded cursor-pointer w-fit"
        onClick={createProject}
      >
        Create Project
      </div>
    </div>
  );
};

export default Dashboard;

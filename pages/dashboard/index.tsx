import React, { useEffect } from "react";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import axios from "axios";

const Dashboard = () => {
  const getUser = async () => {
    await axios
      .get(`${urlFetcher()}/api/user/getuser`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);
  return <div>This is dashboard view.</div>;
};

export default Dashboard;

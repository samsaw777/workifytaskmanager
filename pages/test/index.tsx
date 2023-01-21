import React, { useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";

const Test = () => {
  useEffect(() => {
    axios
      .post(`${urlFetcher()}/api/test`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);
  return <div>This is it</div>;
};

export default Test;

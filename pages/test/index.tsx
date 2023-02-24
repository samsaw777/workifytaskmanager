import React, { useEffect } from "react";
import axios from "axios";

const Test = () => {
  const loginInBitBucket = async () => {
    axios
      .get("http://localhost:5000/auth/bitbucket")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return <button onClick={loginInBitBucket}>This is it</button>;
};

export default Test;

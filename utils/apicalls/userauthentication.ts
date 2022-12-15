import axios from "axios";
import { urlFetcher } from "../Helper/urlFetcher";
import Toast from "react-hot-toast";
import { NextRouter } from "next/router";

export const LogoutUser = async (router: NextRouter) => {
  const notification = Toast.loading("Logging Out User");
  try {
    await axios
      .post(`${urlFetcher()}/api/authentication/logout`)
      .then((res) => {
        Toast.success("User Logged Out!", {
          id: notification,
        });
        router.push(`${urlFetcher()}/login`);
      })
      .catch((err) => {
        Toast.error("Something Went Wrong", {
          id: notification,
        });
      });
  } catch (error: any) {
    console.log(error.message);
  }
};

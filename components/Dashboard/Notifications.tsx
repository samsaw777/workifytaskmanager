import React from "react";
import { ProjectState } from "../../Context/ProjectContext";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import toast from "react-hot-toast";
import io from "socket.io-client";
let socket: any;

const Notifications = () => {
  const { notifications, setNotifications, loggedInUser, members, setMembers } =
    ProjectState();

  const getNotifications = async () => {
    try {
      await axios
        .post(`${urlFetcher()}/api/project/getnotifications`, {
          userId: loggedInUser.id,
        })
        .then((res) => {
          setNotifications([...res.data]);
          console.log(res.data);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  const acceptRequest = async (projectId: number) => {
    if (members.find((member: any) => member.userId === loggedInUser.id)) {
      toast.error("User Already Exists");
      return;
    }
    const notification = toast.loading("Adding Member");
    try {
      const { data } = await axios.post(
        `${urlFetcher()}/api/project/addmember`,
        {
          userId: loggedInUser.id,
          userName: loggedInUser.username,
          userProfile: loggedInUser.profile,
          projectId,
        }
      );

      // setMembers([...members, data]);
      socket.emit("memberadded", {
        project: {
          members,
          projectId,
        },
        senderId: loggedInUser.id,
        newMemberDetails: data,
        section: "members",
        type: "addmember",
      });

      // socket.emit("notification", { userId: loggedInUser.id, data });
      toast.success("Member Added!", {
        id: notification,
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  React.useEffect(() => {
    getNotifications();
    socketInit();
  }, []);

  return (
    <div>
      {notifications.map((notification: any, index: number) => {
        return (
          <div key={index}>
            <p>{notification.title}</p>
            {notification.request && (
              <span
                className="cursor-pointer"
                onClick={() => acceptRequest(notification.projectId)}
              >
                Accept
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;

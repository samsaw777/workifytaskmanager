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

  // const getNotifications = async () => {
  //   try {
  //     await axios
  //       .post(`${urlFetcher()}/api/project/getnotifications`, {
  //         userId: loggedInUser.id,
  //       })
  //       .then((res) => {
  //         setNotifications([...res.data]);
  //         console.log(res.data);
  //       });
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  const acceptRequest = async (projectId: number, notificationId: number) => {
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
          notificationId,
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

  const deleteNotification = async (notificationId: number) => {
    const notification = toast.loading("Deleting Notification");

    try {
      axios
        .post(`${urlFetcher()}/api/project/deletenotification`, {
          notificationId,
        })
        .then((response) => {
          setNotifications(
            notifications.filter(
              (notification: any) => notification.id !== notificationId
            )
          );
          toast.success("Deleted Notification!", { id: notification });
        });
    } catch (error: any) {
      toast.error(error.message, {
        id: notification,
      });
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    // getNotifications();
    socketInit();
  }, []);

  return (
    <div className="">
      <h1 className="font-bold">Your's Notifications</h1>
      <div className="grid grid-cols-2 gap-2 h-[80vh] overflow-y-scroll">
        {notifications.map((notification: any, index: number) => {
          return (
            <div
              key={index}
              className="p-2 border-2 border-gray-100 flex space-x-2 justify-between bg-white items-center rounded-md"
            >
              <p className="max-w-md text-gray-600 text-sm">
                {notification.title}
              </p>
              {notification.request && notification.isPending && (
                <div className="flex space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    onClick={() => deleteNotification(notification.id)}
                    className="w-6 h-6 p-1 text-red-500 cursor-pointer
                  hover:bg-red-200 hover:text-red-600 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 p-1 hover:bg-green-200 text-green-500 hover:text-green-600 rounded-full cursor-pointer"
                    onClick={() =>
                      acceptRequest(notification.projectId, notification.id)
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              )}

              {!notification.isPending && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  onClick={() => deleteNotification(notification.id)}
                  className="w-6 h-6 cursor-pointer rounded-md p-1 hover:bg-red-200 hover:text-red-500 text-red-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;

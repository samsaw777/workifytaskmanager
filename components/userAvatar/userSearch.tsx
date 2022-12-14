import React, { useEffect } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import axios from "axios";
import io from "socket.io-client";
import { ProjectState } from "../../Context/ProjectContext";
let socket: any;
interface User {
  id: string;
  email: string;
  username: string;
  profile: string;
}

interface Props {
  user: User;
  index: number;
  projectId: number;
  closeModal: () => Promise<void>;
}

const UserSearch = ({ user, index, projectId, closeModal }: Props) => {
  const { loggedInUser, members, setMembers } = ProjectState();

  const socketInit = async () => {
    await fetch("/api/socket");

    socket = io();
  };

  useEffect(() => {
    socketInit();
  }, []);

  const addMember = async (
    userId: string,
    userEmail: string,
    userProfile: string
  ) => {
    if (members.find((member: any) => member.userId === user.id)) {
      toast.error("User Already Exists");
      return;
    }

    const adminUser = members.filter((member: any) => member.role == "ADMIN");

    if (!adminUser.find((member: any) => member.userId == loggedInUser.id)) {
      toast.error("Only Admin can added the user in the group!");
      return;
    }
    const notification = toast.loading("Adding Member");
    try {
      const { data } = await axios.post(
        `${urlFetcher()}/api/project/addmember`,
        {
          userId,
          userEmail,
          userProfile,
          projectId: projectId,
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
      toast.success("Member Added!", {
        id: notification,
      });
      closeModal();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <div
      className="w-full p-3 rounded-md flex items-center space-x-4 bg-gray-200 cursor-pointer mt-1"
      key={index}
      onClick={() => addMember(user.id, user.email, user.profile)}
    >
      {user.profile ? (
        <div className="w-10 h-10 rounded-full items-center flex overflow-hidden">
          <Image
            src={user.profile}
            width={100}
            height={100}
            alt="UserProfile"
          />
        </div>
      ) : (
        <FaUserCircle className="text-4xl text-violet-400 cursor-pointer" />
      )}

      <div className="flex flex-col">
        <div className="text-md font-bold">{user.username}</div>
        <div className="text-xs font-light">{user.email}</div>
      </div>
    </div>
  );
};

export default UserSearch;

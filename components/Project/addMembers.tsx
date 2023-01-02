import React, { useState } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import AddMembersModal from "../Modals/AddMemberModal";
import toast from "react-hot-toast";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaUserCheck, FaUserMinus } from "react-icons/fa";
import io from "socket.io-client";
import MembersOptions from "../../utils/Helper/MembersOptions";
import { ProjectState } from "../../Context/ProjectContext";
import MembersLoading from "../../components/Loading/MemberLoading";

let socket: any;

interface Props {
  projectId: number;
}

const AddMembers = ({ projectId }: Props) => {
  const { loggedInUser, members, setMembers } = ProjectState();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [optionIndex, setOptionIndex] = useState<number>(-1);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();

    socket.emit("setup", loggedInUser);

    // socket.on("memberlist", (newMemberDetails: any) => {
    //   if (newMemberDetails.project.projectId == projectId) {
    //     setMembers((current: any) => [
    //       ...current,
    //       newMemberDetails.newMemberDetails,
    //     ]);
    //   }
    // });

    getMembers();
  };

  const getMembers = async () => {
    try {
      setLoading(true);
      await axios
        .post(`${urlFetcher()}/api/project/getmembers`, {
          projectId,
        })
        .then(({ data }) => {
          setLoading(false);
          setMembers(data);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    socketInit();
  }, []);

  const makeAdmin = async (memberId: number, index: number) => {
    const adminUser = members.filter((member: any) => member.role == "ADMIN");

    if (!adminUser.find((member: any) => member.userId == loggedInUser.id)) {
      toast.error("Only Admin can assign user role!");
      return;
    }

    const notification = toast.loading("Making Member Admin");
    try {
      const { data } = await axios.post(
        `${urlFetcher()}/api/project/makeadmin`,
        {
          memberId,
        }
      );

      socket.emit("memberadded", {
        project: {
          projectId,
          members,
        },
        senderId: loggedInUser.id,
        index: index,
        section: "members",
        type: "makeadmin",
      });

      toast.success("Member is not Admin!", {
        id: notification,
      });

      setOptionIndex(-1);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  const makeMember = async (memberId: number, index: number) => {
    const newMembers = JSON.parse(JSON.stringify(members));
    const adminUser = members.filter((member: any) => member.role == "ADMIN");

    if (!adminUser.find((member: any) => member.userId == loggedInUser.id)) {
      toast.error("Only Admin can assign role!");
      return;
    }

    const notification = toast.loading("Making User A Member");
    try {
      const { data } = await axios.post(
        `${urlFetcher()}/api/project/removeadmin`,
        {
          memberId,
        }
      );

      socket.emit("memberadded", {
        project: {
          projectId,
          members,
        },
        senderId: loggedInUser.id,
        index: index,
        section: "members",
        type: "makemember",
      });

      toast.success("User is now a Member!", {
        id: notification,
      });

      setOptionIndex(-1);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  const removeMember = async (memberId: number) => {
    const adminUser = members.filter((member: any) => member.role == "ADMIN");

    if (!adminUser.find((member: any) => member.userId == loggedInUser.id)) {
      toast.error("Only Admin can remove user from the Workspace!");
      return;
    }
    const notification = toast.loading("Removing Member");
    try {
      const { data } = await axios.post(
        `${urlFetcher()}/api/project/removemember`,
        {
          memberId,
        }
      );

      console.log(data);

      setMembers(members.filter((member: any) => member.id !== data.id));

      socket.emit("memberadded", {
        project: {
          members,
          projectId,
        },
        senderId: loggedInUser.id,
        newMemberDetails: data,
        section: "members",
        type: "removemember",
      });
      toast.success("Member Removed!", {
        id: notification,
      });

      setOptionIndex(-1);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  const openOptions = (index: number) => {
    setOptionIndex(index);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mx-5 flex flex-col">
      <AddMembersModal
        projectId={projectId}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      <div
        className="p-2 bg-green-400 rounded-md w-fit ml-auto cursor-pointer text-white font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        Add Members
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 mt-5">
          {[...Array(3)].map(() => (
            <MembersLoading />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-5">
          {members.map((member: any, index: number) => (
            <div
              className="w-full p-3 rounded-md flex justify-between items-center bg-gray-200 mt-1"
              key={index}
            >
              <div className="flex space-x-4 items-center">
                {member.profileImage ? (
                  <div className="w-10 h-10 rounded-full items-center flex overflow-hidden">
                    <Image
                      src={member.profileImage}
                      width={100}
                      height={100}
                      alt="UserProfile"
                    />
                  </div>
                ) : (
                  <FaUserCircle className="text-4xl text-violet-400 cursor-pointer" />
                )}

                <div className="flex flex-col space-y-1">
                  <div className="text-md font-semibold">{member.email}</div>
                  <div
                    className={`text-sm ${
                      member.role == "ADMIN" ? "text-blue-400" : "text-red-400"
                    }`}
                  >
                    {member.role}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="cursor-pointer"
                  onClick={() => openOptions(index)}
                >
                  <BiDotsVerticalRounded />
                </div>
                {isExpanded && index == optionIndex && (
                  <div className="absolute bg-white option border-2  z-20">
                    <div
                      className="flex space-x-1 items-center cursor-pointer p-2 bg-white group optadmin"
                      onClick={
                        member.role == "ADMIN"
                          ? () => makeMember(member.id, index)
                          : () => makeAdmin(member.id, index)
                      }
                    >
                      <FaUserCheck className="w-6 h-6 p-1" />

                      <div className="remove font-semibold">
                        {member.role == "ADMIN" ? "Make Member" : "Make Admin"}
                      </div>
                    </div>
                    <div
                      className="flex space-x-1 items-center cursor-pointer p-2 bg-white group opt"
                      onClick={() => removeMember(member.id)}
                    >
                      <FaUserMinus className="w-6 h-6 p-1" />

                      <div className="remove font-semibold">Remove Member</div>
                    </div>
                  </div>
                )}
              </div>
              {/* <MembersOptions removeMember={removeMember} memberId={member.id} /> */}
              {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer p-1 hover:bg-red-200 rounded hover:text-red-700 text-[#707070] font-bold"
              onClick={() => removeMember(member.id)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddMembers;

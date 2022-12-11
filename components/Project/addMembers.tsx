import React, { useState } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import AddMembersModal from "../Modals/AddMemberModal";

interface LoggedInUser {
  id: string;
  email: string;
  profileImage: string;
}

interface Props {
  loggedInUser: LoggedInUser;
  projectId: number;
}

const AddMembers = ({ loggedInUser, projectId }: Props) => {
  const [members, setMembers] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log(members.filter((member: any) => member.role === "ADMIN"));
  const getMembers = async () => {
    try {
      const { data } = await axios.post(
        `${urlFetcher()}/api/project/getmembers`,
        {
          projectId,
        }
      );

      setMembers(data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    getMembers();
  }, []);

  return (
    <div className=" mx-5 flex flex-col">
      <AddMembersModal
        projectId={projectId}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        members={members}
        loggedInUser={{ id: loggedInUser.id }}
      />
      <div
        className="p-2 bg-green-400 rounded-md w-fit ml-auto cursor-pointer text-white font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        Add Members
      </div>
      <div className="grid grid-cols-2 gap-4">
        {members.map((member: any, index: number) => (
          <div
            className="w-full p-3 rounded-md flex items-center space-x-4 bg-gray-200 mt-1"
            key={index}
          >
            {member.profileImage ? (
              <div className="w-10 h-10 rounded-full items-center flex">
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
        ))}
      </div>
    </div>
  );
};

export default AddMembers;

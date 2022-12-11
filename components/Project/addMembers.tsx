import React, { useState } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import UserAvatar from "../../components/userAvatar/userSearch";
import { url } from "inspector";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import AddMembersModal from "../Modals/AddMemberModal";

interface User {
  id: string;
  email: string;
  username: string;
  profile: string;
  password: string;
}

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
  const [search, setSearch] = useState<string>("");
  const [searchedUser, setSearchUser] = useState<User[]>([]);

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

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (search == "") {
      setSearchUser([]);
      console.log("Please search a user");
      return;
    }

    try {
      const { data } = await axios.get(
        `${urlFetcher()}/api/user/searchusers?search=${search}`
      );
      setSearchUser(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <AddMembersModal />
      <form onSubmit={(e) => handleSearch(e)}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-[90%] p-2 border-2 border-blue-300"
          placeholder="Enter Name To Search User"
        />
        <button className="hidden" type="submit"></button>
      </form>
      <div className="grid grid-cols-2 gap-4 mt-5 mx-5">
        {searchedUser.map((user: User, index: number) => (
          <UserAvatar
            index={index}
            user={{
              id: user.id,
              email: user.email,
              username: user.username,
              profile: user.profile,
            }}
            projectId={projectId}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mx-5">
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

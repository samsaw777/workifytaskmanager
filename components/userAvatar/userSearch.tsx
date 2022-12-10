import React from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

interface User {
  id: string;
  email: string;
  username: string;
  profile: string;
}

interface Props {
  user: User;
  index: number;
}

const UserSearch = ({ user, index }: Props) => {
  return (
    <div
      className="w-full p-3 rounded-md flex items-center space-x-4 bg-gray-200"
      key={index}
    >
      {user.profile ? (
        <div className="w-10 h-10 rounded-full items-center flex">
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

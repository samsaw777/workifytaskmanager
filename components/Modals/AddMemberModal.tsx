import React, { useState } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import UserAvatar from "../userAvatar/userSearch";

interface User {
  id: string;
  email: string;
  username: string;
  profile: string;
  password: string;
}

interface LoggedInUser {
  id: string;
}

interface Props {
  projectId: number;
  loggedInUser: LoggedInUser;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  members: any;
}

const AddMemberModal = ({
  projectId,
  setIsOpen,
  isOpen,
  members,
  loggedInUser,
}: Props) => {
  const [search, setSearch] = useState<string>("");
  const [searchedUser, setSearchUser] = useState<User[]>([]);

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

  const closeModal = async () => {
    setSearch("");
    setSearchUser([]);
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center `}
      id="overlay"
      //   onClick={() => setIsOpen(!isOpen)}
    >
      <div className="bg-white w-[550px] max-h-[700px] py-4 px-4 rounded-md shadow-xl text-gray-800">
        <div className="flex justify-center flex-col-reverse">
          <h4 className="text-lg font-bold text-center flex-grow">
            Add users to the project
          </h4>
          <svg
            className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-full"
            id="close-modal"
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => closeModal()}
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="mt-2">
          <form onSubmit={(e) => handleSearch(e)}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="w-[100%] p-2 border-2 border-blue-300 focus:border-blue-300 focus:outline-none"
              placeholder="Enter Name To Search User"
            />
            <button className="hidden" type="submit"></button>
          </form>
        </div>
        <div className="w-full mt-5">
          {searchedUser.map((user: User, index: number) => (
            <div key={index}>
              <UserAvatar
                index={index}
                user={{
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  profile: user.profile,
                }}
                projectId={projectId}
                members={members}
                loggedInUser={loggedInUser}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;

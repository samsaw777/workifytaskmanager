import React, { useState } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import UserAvatar from "../../components/userAvatar/userSearch";
import { url } from "inspector";

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

  return (
    <div>
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
    </div>
  );
};

export default AddMembers;

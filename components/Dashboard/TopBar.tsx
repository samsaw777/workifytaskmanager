import React, { Dispatch, SetStateAction } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { useRouter } from "next/router";
import { ProjectState } from "../../Context/ProjectContext";

type Props = {
  openSideBar: boolean;
  setOpenSideBar: Dispatch<SetStateAction<boolean>>;
};

const TopBar = ({ openSideBar, setOpenSideBar }: Props) => {
  const { pathname } = useRouter();
  const { loggedInUser } = ProjectState();

  return (
    <div className="h-[8vh] p-5 bg-[white] flex items-center mx-3 rounded-md my-2 shadow-md justify-between">
      <div className="flex space-x-2 items-center">
        <MdMenu
          className="hover:bg-violet-200 w-8 h-8 p-1  rounded cursor-pointer"
          onClick={() => setOpenSideBar(!openSideBar)}
        />

        {/* {pathname.slice(1) == "dashboard" ? (
          <div>Dashboard</div>
        ) : (
          <div>Project</div>
        )} */}
      </div>
      <div className="flex space-x-2 items-center">
        <div className="flex flex-col space-y-1 items-center">
          <span className="ml-auto text-md font-bold">
            {loggedInUser?.username}
          </span>
          <span className="ml-auto text-xs text-gray-800">
            {loggedInUser?.email}
          </span>
        </div>
        <FaUserCircle className="text-4xl text-violet-400 cursor-pointer" />
      </div>
    </div>
  );
};

export default TopBar;

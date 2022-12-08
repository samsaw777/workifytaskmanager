import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Project from "../../images/project.svg";
import { menu } from "../../utils/Data/MenuData";

interface Props {
  openSidebar: boolean;
  setShowContent: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardSidebar = ({ openSidebar, setShowContent }: Props) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<number>(0);

  const setActiveMenu = (title: string, index: number): any => {
    setShowContent(title);
    setCurrentMenu(index);
  };

  const logoutUser = () => {
    console.log("Logout user!");
  };

  return (
    <div
      className={` ${
        openSidebar ? "w-72" : "w-20 "
      } bg-white shadow-md h-screen p-5  pt-8 relative duration-300`}
    >
      <div className="inline-flex items-center cursor-pointer h-[5vh]">
        <div className="w-12 h-12 block float-left mr-2 cursor-pointer text-[#695CFE]">
          <Image src={Project} width={100} height={100} alt="Sidebar Logo" />
        </div>
        <h1
          className={`text-2xl font-bold text-[#695CFE] origin-left duration-300 ${
            !openSidebar && "scale-0"
          }`}
        >
          Workify
        </h1>
      </div>
      <ul className="pt-6">
        {menu.map((Menu, index) => (
          <li
            key={index}
            className={`flex  rounded-md p-2 cursor-pointer hover:bg-[#695CFE] hover:text-white   text-sm items-center gap-x-4 
              ${Menu.spacing ? "mt-9" : "mt-2"} ${
              index === currentMenu
                ? "bg-[#695CFE] text-white font-bold bg-opacity-100"
                : "text-[#707070]"
            } 
            ${Menu.title == "Logout" && "hover:bg-red-400 hover:font-bold"}
              `}
            onClick={
              Menu.title == "Logout"
                ? logoutUser
                : () => setActiveMenu(Menu.title, index)
            }
          >
            <span className="text-2xl block float-left">{Menu.icon}</span>

            <span
              className={`${
                !openSidebar && "hidden"
              } text-base font-medium origin-left flex-1 duration-200`}
            >
              {Menu.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardSidebar;

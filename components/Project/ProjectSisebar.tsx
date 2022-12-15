import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";
import Project from "../../images/project.svg";
import { projectMenu } from "../../utils/Data/MenuData";
import toast from "react-hot-toast";
import { BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";
import { AiOutlineCaretDown } from "react-icons/ai";
import { LogoutUser } from "../../utils/apicalls/userauthentication";

type Props = {
  openSidebar: boolean;
  setShowContent: React.Dispatch<React.SetStateAction<string>>;
  projectTitle: string;
  //   showContent: string;
};

const ProjectSideBar = ({
  openSidebar,
  setShowContent,
  projectTitle,
}: //
//   showContent,
Props) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>("Dashboard");
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<boolean>(false);
  const [subMenuIndex, setSubMenuIndex] = useState<number>(-1);

  const setActiveMenu = (title: string, index: number): any => {
    setShowContent(title);
    setCurrentMenu(title);
  };

  const openSubMenu = (index: number): void => {
    setSubMenuIndex(index);
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div
      className={` ${
        openSidebar ? "w-72" : "w-20 "
      } bg-white shadow-md h-screen p-5  pt-8 relative duration-300`}
    >
      <div className="inline-flex items-center cursor-pointer h-[10vh]">
        <div className="w-12 h-12 block float-left mr-2 cursor-pointer text-[#695CFE]">
          <Image src={Project} width={100} height={100} alt="ProjectImage" />
        </div>
        <h1
          className={`text-lg font-bold text-[#695CFE] origin-left duration-300 ${
            !openSidebar && "scale-0"
          }`}
        >
          {projectTitle}
        </h1>
      </div>
      <ul className="pt-6">
        {projectMenu.map((Menu: any, index: number) => (
          <div key={index}>
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-[#695CFE] hover:text-white   text-sm items-center gap-x-4 
              ${Menu.spacing ? "mt-9" : "mt-2"} ${
                Menu.title === "showContent"
                  ? "bg-[#695CFE] text-white font-bold bg-opacity-100"
                  : "text-[#707070]"
              } 
            ${Menu.title == "Logout" && "hover:bg-red-400 hover:font-bold"}
              `}
              onClick={
                Menu.title == "Logout"
                  ? () => LogoutUser(router)
                  : () => {
                      if (
                        Menu.title == "Scrum" ||
                        Menu.title == "KanBan" ||
                        Menu.title == "Bug"
                      ) {
                        openSubMenu(index);
                      } else {
                        setActiveMenu(Menu.title, index);
                      }
                    }
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
              {Menu.isSubMenu && openSidebar && (
                <AiOutlineCaretDown
                  className={`text-md ${
                    isSubMenuOpen && subMenuIndex == index && "rotate-180"
                  }`}
                  onClick={() => {
                    openSubMenu(index);
                  }}
                />
              )}
            </li>
            {Menu.isSubMenu &&
              isSubMenuOpen &&
              openSidebar &&
              subMenuIndex == index && (
                <ul className="p-2">
                  {Menu.subMenu.map((menu: any, index: number) => (
                    <li
                      key={index}
                      onClick={() => setActiveMenu(menu.title, index)}
                      className={`flex  rounded-md p-2 cursor-pointer hover:bg-[#695CFE] hover:text-white mt-2 text-sm items-center gap-x-4 
                      ${menu.spacing && "mt-9"} ${
                        menu.title === "showContent"
                          ? "bg-[#695CFE] text-white font-bold bg-opacity-100"
                          : "text-[#707070] font-medium"
                      } 
                    `}
                    >
                      {menu.title == "kboard" ||
                      menu.title === "sboard" ||
                      menu.title === "bboard"
                        ? "board"
                        : menu.title}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ProjectSideBar;

import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { MdDashboard, MdGroups } from "react-icons/md";
import {
  AiOutlineMail,
  AiFillSetting,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BiTask, BiUser, BiLogOut } from "react-icons/bi";

export const menu = [
  // { title: "Dashboard", icon: <MdDashboard /> },
  {
    title: "Projects",
    spacing: true,
    icon: <BsReverseLayoutTextSidebarReverse />,
  },
  {
    title: "Inbox",
    icon: <AiOutlineMail />,
  },
  { title: "Tasks", icon: <BiTask /> },
  // { title: "Profile", spacing: true, icon: <BiUser /> },
  // { title: "Settings", icon: <AiFillSetting /> },
  { title: "Logout", icon: <BiLogOut />, spacing: true },
];

export const projectMenu = [
  // { title: "Board", icon: <MdDashboard /> },
  {
    title: "Calendar",
    spacing: true,
    icon: <AiTwotoneCalendar />,
  },

  {
    title: "Scrum",
    icon: <BiTask />,
    isSubMenu: true,
    subMenu: [{ title: "scrumboard" }, { title: "backlog" }],
  },
  {
    title: "KanBan",
    icon: <BiTask />,
    isSubMenu: true,
    subMenu: [{ title: "kboard" }],
  },
  // {
  //   title: "Bug",
  //   icon: <BiTask />,
  //   isSubMenu: true,
  //   subMenu: [{ title: "bboard" }],
  // },
  // {
  //   title: "Github",
  //   icon: <AiOutlineMail />,
  // },
  { title: "Members", icon: <MdGroups /> },
  { title: "Settings", icon: <AiFillSetting /> },
  { title: "Logout", icon: <BiLogOut />, spacing: true },
];

import React, { useState } from "react";
import Dropdown from "../Reuse/Dropdown";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Item {
  id: number;
  title: string;
  color: string;
}

const MenuItems = [
  {
    id: 1,
    title: "Story",
    color: "green",
  },
  {
    id: 2,
    title: "Task",
    color: "blue",
  },
  {
    id: 3,
    title: "Bug",
    color: "red",
  },
];

const IssueModal = ({ isOpen, setIsOpen }: Props) => {
  const [selectedItem, setSelectedItem] = useState<Item>(MenuItems[0]);
  const [issueName, setIssueName] = useState<string>("");
  return (
    <div
      className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center `}
      id="overlay"
      //   onClick={() => setIsOpen(!isOpen)}
    >
      <div className="bg-white w-[550px] h-[200px] py-4 px-4 rounded-md shadow-xl text-gray-800">
        <div className="flex">
          <span className="flex-grow w-full text-gray-700 text-md font-semibold">
            Scrum / New1
          </span>

          <svg
            className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-full"
            id="close-modal"
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => setIsOpen(!isOpen)}
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="flex mt-2 items-center space-x-2">
          <div className="w-[20%]">
            <Dropdown
              menuItems={MenuItems}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <div className="w-[70%]">
            <form>
              <input
                type="text"
                value={issueName}
                onChange={(e) => setIssueName(e.target.value)}
                className="py-1 px-2 focus:outline-none focus:border-blue-500 border-2 border-gray-200 w-full placeholder:text-gray-500"
                placeholder="Enter Issue Name"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;

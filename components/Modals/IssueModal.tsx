import React, { useState, useEffect } from "react";
import Dropdown from "../Reuse/Dropdown";
import { ProjectState } from "../../Context/ProjectContext";
import Toast from "react-hot-toast";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";

type UpdateIssue = {
  type: string;
  id: number;
  issue: string;
  index: number;
};

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateIssueDetails: React.Dispatch<React.SetStateAction<UpdateIssue>>;
  updateIssueDetails: UpdateIssue;
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
    color: "#86efac",
  },
  {
    id: 2,
    title: "Task",
    color: "#93c5fd",
  },
  {
    id: 3,
    title: "Bug",
    color: "#fca5a5",
  },
];

const IssueModal = ({
  isOpen,
  setIsOpen,
  updateIssueDetails,
  setUpdateIssueDetails,
}: Props) => {
  const {
    setIssues,
    issues,
    project: { id, board },
    loggedInUser,
  } = ProjectState();

  const updateItem = MenuItems.filter(
    (item) => item.title == updateIssueDetails.type
  );
  useEffect(() => {
    if (Object.keys(updateIssueDetails).length > 0) {
      setSelectedItem(
        updateIssueDetails.issue != "" ? updateItem[0] : MenuItems[0]
      );
      setIssueName(updateIssueDetails.issue);
    }
  }, [isOpen]);

  const [selectedItem, setSelectedItem] = useState<Item>(
    MenuItems.filter((item) => item.title == updateIssueDetails.type)[0]
  );
  const [issueName, setIssueName] = useState<string>("");

  const cancelIssue = () => {
    setIssueName("");
    setSelectedItem(MenuItems[0]);
    setIsOpen(!isOpen);
    setUpdateIssueDetails({ type: "Story", id: 0, issue: "", index: 0 });
  };

  const createIssue = async (e: any) => {
    e.preventDefault();
    const notification = Toast.loading("Creating Issue");
    try {
      const boardInfo = board.filter(
        (boardValue: any) => boardValue.type == "SCRUM"
      );

      const sectionInfo = boardInfo[0].sections?.filter(
        (section: any) => section.title == "To DO"
      );
      await axios
        .post(`${urlFetcher()}/api/scrum/issue/createissue`, {
          type: selectedItem.title,
          issue: issueName,
          username: loggedInUser.username,
          profile: loggedInUser.profile,
          userId: loggedInUser.id,
          sectionId: sectionInfo[0].id,
          sectionName: sectionInfo[0].title,
          projectId: id,
        })
        .then((res) => {
          setIssueName("");
          setSelectedItem(MenuItems[0]);

          setIssues([...issues, res.data]);
          setIsOpen(!isOpen);
          Toast.success("Issue Created!", { id: notification });
        });
    } catch (error: any) {
      Toast.error(error.message, { id: notification });
    }
  };

  const updateIssue = async (e: any) => {
    e.preventDefault();
    const notification = Toast.loading("Updating Issue");

    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/issue/updateissue`, {
          issueId: updateIssueDetails.id,
          type: selectedItem.title,
          issue: issueName,
        })
        .then((res) => {
          const newIssue = JSON.parse(JSON.stringify(issues));
          newIssue[updateIssueDetails.index].issue = res.data.issue;
          newIssue[updateIssueDetails.index].type = res.data.type;
          setIssues([...newIssue]);
          setIssueName("");
          setSelectedItem(MenuItems[0]);
          setIsOpen(!isOpen);
          setUpdateIssueDetails({
            type: "Story",
            id: 0,
            issue: "",
            index: 0,
          });

          Toast.success("Issue Updated", { id: notification });
        });
    } catch (error: any) {
      Toast.error(error.message, { id: notification });
    }
  };

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
            onClick={() => cancelIssue()}
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <form
          onSubmit={
            updateIssueDetails.issue != ""
              ? (e) => updateIssue(e)
              : (e) => createIssue(e)
          }
        >
          <div className="flex mt-2 items-center space-x-2 w-full">
            <div className="w-[20%]">
              <Dropdown
                menuItems={MenuItems}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                updateIssueDetails={updateIssueDetails}
                isOpenModal={isOpen}
              />
            </div>
            <div className="w-[80%]">
              <input
                type="text"
                value={issueName}
                onChange={(e) => setIssueName(e.target.value)}
                className="py-1 px-2 focus:outline-none focus:border-blue-500 border-2 border-gray-200 w-full placeholder:text-gray-500"
                placeholder="Enter Issue Name"
              />
            </div>
          </div>
          <div className="flex w-full justify-end mt-16 space-x-4">
            <button
              className="px-3 py-1 rounded   text-gray-400 border border-gray-300 hover:border-gray-800 hover:font-bold"
              type="button"
              onClick={() => cancelIssue()}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-green-500 text-white hover:bg-green-600 hover:text-white font-medium rounded"
              type="submit"
            >
              {updateIssueDetails.issue != "" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;

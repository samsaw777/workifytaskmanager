import React, { useState, useEffect } from "react";
import Dropdown from "../Reuse/Dropdown";
import { ProjectState } from "../../Context/ProjectContext";
import Toast from "react-hot-toast";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import io, { Socket } from "socket.io-client";

type UpdateIssue = {
  type: string;
  id: number;
  title: string;
  index: number;
  sprintId: number;
  description: string;
};

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateIssueDetails: React.Dispatch<React.SetStateAction<UpdateIssue>>;
  updateIssueDetails: UpdateIssue;
  setIssueCheck: React.Dispatch<React.SetStateAction<string>>;
  setSprintDetails: React.Dispatch<
    React.SetStateAction<{ id: number; sprintName: string }>
  >;
  sprintDetails: { id: number; sprintName: string };
  socket: Socket;
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
  setIssueCheck,
  setSprintDetails,
  sprintDetails,
  socket,
}: Props) => {
  const {
    setIssues,
    issues,
    project: { id, board, members },
    loggedInUser,
    sprints,
  } = ProjectState();

  const updateItem = MenuItems.filter(
    (item) => item.title == updateIssueDetails.type
  );

  useEffect(() => {
    if (Object.keys(updateIssueDetails).length > 0) {
      setSelectedItem(
        updateIssueDetails.title != "" ? updateItem[0] : MenuItems[0]
      );
      setIssueDescription(updateIssueDetails.description);
      setIssueName(updateIssueDetails.title);
    }
  }, [isOpen]);

  const [selectedItem, setSelectedItem] = useState<Item>(
    MenuItems.filter((item) => item.title == updateIssueDetails.type)[0]
  );
  const [issueName, setIssueName] = useState<string>("");
  const [issueDescription, setIssueDescription] = useState<string>("");

  const cancelIssue = () => {
    setIssueName("");
    setIssueDescription("");
    setIssueCheck("");
    setSelectedItem(MenuItems[0]);
    setIsOpen(!isOpen);
    setSprintDetails({ id: 0, sprintName: "" });
    setUpdateIssueDetails({
      type: "Story",
      id: 0,
      title: "",
      sprintId: 0,
      index: -1,
      description: "",
    });
  };

  const createIssue = async (e: any) => {
    e.preventDefault();
    const notification = Toast.loading("Creating Issue");
    try {
      const boardInfo = board.filter(
        (boardValue: any) => boardValue.type == "SCRUM"
      );

      const sectionInfo = boardInfo[0].sections?.filter(
        (section: any) => section.title == "To Do"
      );
      await axios
        .post(`${urlFetcher()}/api/scrum/issue/createissue`, {
          type: selectedItem.title,
          title: issueName,
          description: issueDescription,
          username: loggedInUser.username,
          profile: loggedInUser.profile,
          userId: loggedInUser.id,
          sectionId: sectionInfo[0].id,
          sectionName: sectionInfo[0].title,
          projectId: id,
          sprintId: sprintDetails.id,
          sprintName: sprintDetails.sprintName,
          isUnderStartSprint: false,
        })
        .then((res) => {
          setIssueName("");
          setSelectedItem(MenuItems[0]);
          setIssueCheck("");

          socket.emit("issueCreated", {
            projectId: id,
            members,
            sprintId: sprintDetails.id,
            issue: res.data,
            section: "backlog",
            type: "addissue",
            sprints,
          });
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
          title: issueName,
          description: issueDescription,
        })
        .then((res) => {
          socket.emit("issueCreated", {
            projectId: id,
            members,
            sprintId: updateIssueDetails.sprintId,
            issue: res.data,
            section: "backlog",
            type: "updateissue",
            sprints,
          });
          setIssueName("");
          setIssueCheck("");
          setSelectedItem(MenuItems[0]);
          setIsOpen(!isOpen);
          setUpdateIssueDetails({
            type: "Story",
            id: 0,
            title: "",
            sprintId: 0,
            index: -1,
            description: "",
          });
          Toast.success("Issue Updated", { id: notification });
        });
    } catch (error: any) {
      // Toast.error(error.message, { id: notification });
      console.log(error);
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
      <div className="bg-white w-[550px] h-[300px] py-4 px-4 rounded-md shadow-xl text-gray-800">
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
            updateIssueDetails.title != ""
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
          <div>
            <input
              type="text"
              className="py-1 mt-4 px-2 h-[100px] focus:outline-none focus:border-blue-500 border-2 border-gray-200 w-full placeholder:text-gray-500"
              placeholder="Enter Issue Description"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
            />
          </div>
          <div className="flex w-full justify-end mt-12 space-x-4">
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
              {updateIssueDetails.title != "" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;

// setIssuesFunction(index, res.data);
// const sprint: any = sprints.filter(
//   (s: any) => s.id === sprintDetails.id
// );
// sprint[0]?.issues?.push(res.data);

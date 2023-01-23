import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import toast from "react-hot-toast";
import io, { Socket } from "socket.io-client";
import { ProjectState } from "../../../../Context/ProjectContext";
let socket: Socket;

interface Props {
  comment: string;
  username: string;
  comments: {}[];
  setComments: React.Dispatch<React.SetStateAction<{}[]>>;
  id: number;
  index: number;
  profile: string;
  type: string;
}

const Comment = ({
  comment,
  username,
  id,
  index,
  profile,
  comments,
  setComments,
  type,
}: Props) => {
  const [userComment, setUserComment] = useState<string>(comment);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const {
    project: { id: ProjectId },
    loggedInUser,
    members,
  } = ProjectState();

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  useEffect(() => {
    socketInit();
  }, []);

  useEffect(() => {
    setUserComment(comment);
  }, [comment]);

  const deleteTaskComment = async (commentId: number) => {
    const notification = toast.loading("Deleting Comment!");
    try {
      await axios
        .post(
          `${urlFetcher()}/api/comments/${
            type == "kanban" ? "deletetaskcomments" : "deleteissuecomments"
          }`,
          {
            id: commentId,
          }
        )
        .then((res) => {
          socket.emit("commentCreated", {
            ProjectId,
            members,
            comment: res.data,
            type: "deleteComment",
            section: "kanban",
            comments,
          });

          toast.success("Deleted Comment!", {
            id: notification,
          });
        });
    } catch (error: any) {
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  const updateTaskComment = async (
    commentId: number,
    e: any,
    index: number,
    comment: string
  ) => {
    e.preventDefault();
    const notification = toast.loading("Updating Comment!");
    try {
      await axios
        .post(
          `${urlFetcher()}/api/comments/${
            type === "kanban" ? "updatetaskcomments" : "updateissuecomments"
          }`,
          {
            id: commentId,
            comment,
          }
        )
        .then((res) => {
          socket.emit("commentCreated", {
            ProjectId,
            members,
            comment: res.data,
            type: "updateComment",
            section: "kanban",
            comments,
          });

          toast.success("Updated Comment!", {
            id: notification,
          });

          setCurrentIndex(-1);
        });
    } catch (error: any) {
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <div className="flex space-x-2 mt-2 px-3">
      {profile == "" ? (
        <FaUserCircle className="text-3xl text-violet-400 cursor-pointer mt-2" />
      ) : (
        <div className="w-7 h-7 rounded-full items-center flex overflow-hidden mt-2">
          <Image src={profile} width={100} height={100} alt="UserProfile" />
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="text-sm font-medium text-gray-500">{username}</div>
        <form
          className="w-full"
          onSubmit={(e) => updateTaskComment(id, e, index, userComment)}
        >
          <input
            className={`text-md w-full font-medium  ${
              currentIndex == index
                ? "border-2 border-blue-500 p-2 rounded font-normal"
                : ""
            } focus:outline-none `}
            value={userComment}
            readOnly={currentIndex == index ? false : true}
            onChange={(e) => setUserComment(e.target.value)}
          />
          {currentIndex == index ? (
            <div className="flex space-x-2 items-center mt-1">
              <button
                className="text-sm text-white bg-blue-500 rounded py-1 px-2 font-semibold cursor-pointer"
                type="submit"
              >
                Save
              </button>
              <div
                className="text-sm text-gray-500 font-semibold cursor-pointer hover:font-bold"
                onClick={() => setCurrentIndex(-1)}
              >
                Cancel
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              {loggedInUser.username === username && (
                <div
                  className="text-xs text-gray-400 font-semibold cursor-pointer hover:text-gray-500"
                  onClick={() => setCurrentIndex(index)}
                >
                  Edit
                </div>
              )}
              <div
                className="text-xs text-gray-400 font-semibold cursor-pointer hover:text-gray-500"
                onClick={() => deleteTaskComment(id)}
              >
                Delete
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Comment;

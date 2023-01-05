import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { ProjectState } from "../../../../Context/ProjectContext";
import Image from "next/image";
import axios from "axios";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import toast from "react-hot-toast";
import Comment from "./Comment";

interface Props {
  comments: {}[];
  setComments: React.Dispatch<React.SetStateAction<{}[]>>;
  taskId: string;
  loading: boolean;
}

const TaskComments = ({ comments, setComments, taskId, loading }: Props) => {
  const { loggedInUser } = ProjectState();
  const [comment, setComment] = useState<string>("");

  //Create Task Comment Function.
  const createTaskComment = async (e: any) => {
    const notification = toast.loading("Adding Comment");
    try {
      e.preventDefault();
      let allComments = JSON.parse(JSON.stringify(comments));

      allComments = allComments.length > 0 ? allComments : [];
      await axios
        .post(`${urlFetcher()}/api/kanban/task/createcomments`, {
          taskId,
          comment,
          username: loggedInUser.username,
          userProfile: loggedInUser.profile,
        })
        .then((response) => {
          setComments((current) => [...current, response.data]);
          toast.success("Added Comment", {
            id: notification,
          });
          setComment("");
        });
    } catch (error: any) {
      toast.error(error.message, {
        id: notification,
      });
    }
  };
  return (
    <>
      <div className="flex space-x-3 items-center w-full px-2">
        {loggedInUser.profile == "" ? (
          <FaUserCircle className="text-3xl text-violet-400 cursor-pointer" />
        ) : (
          <div className="w-7 h-7 rounded-full items-center flex overflow-hidden">
            <Image
              src={loggedInUser.profile}
              width={100}
              height={100}
              alt="UserProfilxse"
            />
          </div>
        )}
        <form className="w-full" onSubmit={(e) => createTaskComment(e)}>
          <div>
            <input
              className="w-full p-1 rounded border border-gray-300 focus:outline-none"
              placeholder="Add a comment...."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="hidden"></button>
          </div>
        </form>
      </div>
      {loading ? (
        <div className="px-3 text-xs">Loading Comments...</div>
      ) : (
        <div>
          {comments?.length == 0 ? (
            <div className="w-full text-center text-xs text-gray-500 font-medium">
              Add comments to this task...
            </div>
          ) : (
            <div>
              {comments.map((comment: any, index: number) => (
                <Comment
                  index={index}
                  id={comment.id}
                  comment={comment.comment}
                  profile={comment.userProfile}
                  username={comment.username}
                  comments={comments}
                  setComments={setComments}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TaskComments;

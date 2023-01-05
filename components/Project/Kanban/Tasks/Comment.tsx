import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";

interface Props {
  comment: string;
  username: string;
  id: number;
  index: number;
  profile: string;
  deleteTaskComment: (commentId: number) => Promise<void>;
  updateTaskComment: (
    commentId: number,
    e: any,
    index: number,
    comment: string
  ) => Promise<void>;
}

const Comment = ({
  comment,
  username,
  id,
  index,
  profile,
  deleteTaskComment,
  updateTaskComment,
}: Props) => {
  const [userComment, setUserComment] = useState<string>(comment);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  return (
    <div className="flex space-x-2 items-center mt-2 px-3">
      {profile == "" ? (
        <FaUserCircle className="text-3xl text-violet-400 cursor-pointer" />
      ) : (
        <div className="w-7 h-7 rounded-full items-center flex overflow-hidden">
          <Image src={profile} width={100} height={100} alt="UserProfile" />
        </div>
      )}
      <div className="flex flex-col space-y-1 w-full">
        <div className="text-sm font-medium text-gray-600">{username}</div>
        <form
          className="w-full"
          onSubmit={(e) => updateTaskComment(id, e, index, userComment)}
        >
          <input
            className={`text-md w-full  ${
              currentIndex == index
                ? "border-2 border-blue-500 p-2 rounded"
                : ""
            } focus:outline-none`}
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
              <div
                className="text-sm text-gray-500 font-semibold cursor-pointer"
                onClick={() => setCurrentIndex(index)}
              >
                Edit
              </div>
              <div
                className="text-sm text-gray-500 font-semibold cursor-pointer"
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

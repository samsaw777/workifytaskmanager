import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const IssueModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <div
      className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center `}
      id="overlay"
      //   onClick={() => setIsOpen(!isOpen)}
    >
      <div className="bg-white w-[550px] h-[400px] py-4 px-4 rounded-md shadow-xl text-gray-800">
        This is Issue Modal.
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
    </div>
  );
};

export default IssueModal;

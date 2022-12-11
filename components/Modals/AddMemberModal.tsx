import React, { useState } from "react";

const AddMemberModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center `}
      id="overlay"
      //   onClick={() => setIsOpen(!isOpen)}
    >
      <div className="bg-white w-[550px] h-[400px] py-4 px-4 rounded-md shadow-xl text-gray-800">
        This is a add member model
      </div>
    </div>
  );
};

export default AddMemberModal;

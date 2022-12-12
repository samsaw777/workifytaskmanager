import React, { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";

const MemberOptions = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <BiDotsVerticalRounded />
      </div>
      {isExpanded && (
        <div className="absolute bg-white option border-2 border-blue-300 z-20">
          This is the expanded div.
        </div>
      )}
    </div>
  );
};

export default MemberOptions;

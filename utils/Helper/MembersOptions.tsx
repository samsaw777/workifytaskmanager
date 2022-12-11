import React, { useState } from "react";

const MemberOptions = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="">
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Options
      </div>
      {isExpanded && (
        <div className="absolute bg-gray-100 -top-32 border-2 border-blue-300 z-20">
          This is the expanded div.
        </div>
      )}
    </div>
  );
};

export default MemberOptions;

import React, { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaUserCheck, FaUserMinus } from "react-icons/fa";

interface Props {
  removeMember: (memberId: number) => Promise<void>;
  memberId: number;
}

const MemberOptions = ({ removeMember, memberId }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const removeMemberAndClose = async () => {
    await removeMember(memberId);
    setIsExpanded(isExpanded);
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <BiDotsVerticalRounded />
      </div>
      {isExpanded && (
        <div className="absolute bg-white option border-2  z-20">
          <div className="flex space-x-1 items-center cursor-pointer p-2 bg-white group optadmin">
            <FaUserCheck className="w-6 h-6 p-1" />

            <div className="remove font-semibold">Make Admin</div>
          </div>
          <div
            className="flex space-x-1 items-center cursor-pointer p-2 bg-white group opt"
            onClick={() => removeMemberAndClose}
          >
            <FaUserMinus className="w-6 h-6 p-1" />

            <div className="remove font-semibold group-hover:bg-gray-100">
              Remove Member
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberOptions;

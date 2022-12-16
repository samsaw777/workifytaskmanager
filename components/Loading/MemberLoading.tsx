import React from "react";

const MemberLoading = () => {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4 w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-blue-500/[.3] h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-blue-500/[.3] rounded"></div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-blue-500/[.3] rounded col-span-2"></div>
              <div className="h-2 bg-blue-500/[.3] rounded col-span-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLoading;

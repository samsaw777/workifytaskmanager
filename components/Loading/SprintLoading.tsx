import React from "react";

function SprintLoading() {
  return (
    <div className="h-[80vh">
      <div className="w-full p-2 border-2 border-blue-100 rounded-md animate-pulse">
        <div className="w-full flex justify-between animate-pulse">
          <span className="w-16 rounded-md h-4 bg-blue-200"></span>
          <span className="w-16 rounded-md h-4 bg-blue-200"></span>
        </div>
        <div className="animate-pulse flex flex-col mt-3 space-y-2">
          <div className="w-full rounded-md h-10 bg-blue-200"></div>
          <div className="w-full rounded-md h-10 bg-blue-200"></div>
        </div>
      </div>
      <div className="w-full mt-5 p-2 border-2 border-blue-100 rounded-md animate-pulse">
        <div className="w-full flex justify-between animate-pulse">
          <span className="w-16 rounded-md h-4 bg-blue-200"></span>
          <span className="w-16 rounded-md h-4 bg-blue-200"></span>
        </div>
        <div className="animate-pulse flex flex-col mt-3 space-y-2">
          <div className="w-full rounded-md h-10 bg-blue-200"></div>
          <div className="w-full rounded-md h-10 bg-blue-200"></div>
        </div>
      </div>
      <div className="w-full p-2 mt-5 border-2 border-blue-100 rounded-md animate-pulse">
        <div className="w-full flex justify-between animate-pulse">
          <span className="w-16 rounded-md h-4 bg-blue-200"></span>
          <span className="w-16 rounded-md h-4 bg-blue-200"></span>
        </div>
        <div className="animate-pulse flex flex-col mt-3 space-y-2">
          <div className="w-full rounded-md h-10 bg-blue-200"></div>
          <div className="w-full rounded-md h-10 bg-blue-200"></div>
        </div>
      </div>
    </div>
  );
}

export default SprintLoading;

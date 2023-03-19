import React from "react";

const SectionLoading = () => {
  return (
    <div className="flex h-[80vh]">
      <div className="grid grid-cols-3 gap-4 w-4/5">
        {/* Left column */}
        <div className="bg-white rounded-lg  border-2 border-blue-100 shadow p-4 animate-pulse h-[80vh]">
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
        </div>

        {/* Middle column */}
        <div className="bg-white rounded-lg border-2 border-blue-100 shadow p-4 animate-pulse h-[80vh]">
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
        </div>

        {/* Right column */}
        <div className="bg-white rounded-lg shadow p-4 animate-pulse border-2 border-blue-100 h-[80vh]">
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
          <div className="h-10 bg-blue-200 rounded-lg mb-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SectionLoading;

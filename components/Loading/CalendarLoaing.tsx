import React from "react";

const CalendarLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      {/* <div className="w-10 h-10 bg-violet-400 rounded-full animate-pulse mb-4"></div> */}
      <div className="w-64 h-8 bg-blue-200 rounded-lg animate-pulse"></div>
      <div className="grid grid-cols-7 gap-2 mt-2 w-64">
        {Array.from({ length: 42 }).map((_, index) => (
          <div
            key={index}
            className="h-8 bg-blue-300 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLoading;

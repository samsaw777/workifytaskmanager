import React, { useEffect, useState } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import Toast from "react-hot-toast";
import { ProjectState } from "../../Context/ProjectContext";
import io, { Socket } from "socket.io-client";
import updatesprint from "../../pages/api/scrum/sprint/updatesprint";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let socket: Socket;

interface Props {
  setUpdateSprintDetails: React.Dispatch<
    React.SetStateAction<{
      sprintId: number;
      index: number;
      sprintName: string;
      startDate: Date;
      endDate: Date;
    }>
  >;
  updateSprintDetails: {
    sprintId: number;
    index: number;
    sprintName: string;
    startDate: Date;
    endDate: Date;
  };
  setIsSprintModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSprintModalOpen: boolean;
}

const SprintModal = ({
  setUpdateSprintDetails,
  updateSprintDetails,
  setIsSprintModalOpen,
  isSprintModalOpen,
}: Props) => {
  const { project, members, sprints } = ProjectState();
  // console.log(sprints);
  const [sprintName, setSprintName] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState("Option 1");
  const options = ["Option 1", "Option 2", "Option 3"];
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  // console.log(startDate, startTime);

  // const handleDateChange = (date: Date) => {
  //   setSelectedDate(date);
  // };

  // const handleTimeChange = (time: any) => {
  //   console.log(time);
  //   setSelectedTime(time);
  // };

  // const getCombinedDateTime = () => {
  //   const year = selectedDate.getFullYear();
  //   const month = selectedDate.getMonth();
  //   const day = selectedDate.getDate();
  //   const hours = selectedTime.getHours();
  //   const minutes = selectedTime.getMinutes();
  //   const seconds = selectedTime.getSeconds();
  //   const conbined = new Date(year, month, day, hours, minutes, seconds);
  //   console.log(conbined);
  //   const date = new Date(conbined);
  //   const options = {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   };
  //   const formatter = new Intl.DateTimeFormat("en-US", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   });
  //   const formattedDate = formatter.format(date).replace(/[-:]/g, "/");
  //   console.log(formattedDate);
  // };

  // getCombinedDateTime();

  const cancelSprint = () => {
    setSprintName("");
    setIsSprintModalOpen(!isSprintModalOpen);
    setUpdateSprintDetails({
      sprintId: 0,
      index: -1,
      sprintName: "",
      startDate: new Date(),
      endDate: new Date(),
    });
  };

  useEffect(() => {
    if (Object.keys(updateSprintDetails).length > 0) {
      setSprintName(updateSprintDetails.sprintName);
      setStartDate(new Date(updateSprintDetails.startDate));
      setStartTime(new Date(updateSprintDetails.startDate));
      setEndDate(new Date(updateSprintDetails.endDate));
      setEndTime(new Date(updateSprintDetails.endDate));
    }
  }, [isSprintModalOpen]);

  const socketInit = async () => {
    await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  React.useEffect(() => {
    socketInit();
  }, []);

  //function to create Sprints.
  const createSprint = async (e: any) => {
    const startyear = startDate
      ? startDate?.getFullYear()
      : new Date().getFullYear();
    const startmonth = startDate
      ? startDate?.getMonth()
      : new Date().getMonth();
    const startday = startDate ? startDate?.getDate() : new Date().getDate();
    const starthours = startTime
      ? startTime?.getHours()
      : new Date().getHours();
    const startminutes = startTime
      ? startTime?.getMinutes()
      : new Date().getMinutes();
    const startseconds = startTime
      ? startTime?.getSeconds()
      : new Date().getSeconds();

    const endyear = endDate ? endDate?.getFullYear() : new Date().getFullYear();
    const endmonth = endDate ? endDate?.getMonth() : new Date().getMonth();
    const endday = endDate ? endDate?.getDate() : new Date().getDate();
    const endhours = endTime ? endTime?.getHours() : new Date().getHours();
    const endminutes = endTime
      ? endTime?.getMinutes()
      : new Date().getMinutes();
    const endseconds = endTime
      ? endTime?.getSeconds()
      : new Date().getSeconds();

    const combinedStartDate = new Date(
      startyear,
      startmonth,
      startday,
      starthours,
      startminutes,
      startseconds
    );

    const combinedEndDate = new Date(
      endyear,
      endmonth,
      endday,
      endhours,
      endminutes,
      endseconds
    );

    e.preventDefault();
    const notification = Toast.loading("Creating Sprint");
    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/sprint/createsprint`, {
          sprintName,
          boardId: parseInt(project.board[0].id),
          startDate: combinedStartDate,
          endDate: combinedEndDate,
        })
        .then((res) => {
          socket.emit("sprintCreated", {
            ProjectId: project.id,
            sprint: res.data,
            members,
            type: "addsprint",
            section: "backlog",
          });
          // setSprints([...sprints, res.data]);
          cancelSprint();
          Toast.success("Sprint Created!", {
            id: notification,
          });
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  const updateSprint = async (e: any) => {
    e.preventDefault();
    const notification = Toast.loading("Updating Sprint");

    try {
      await axios
        .post(`${urlFetcher()}/api/scrum/sprint/updatesprint`, {
          sprintName,
          sprintId: updateSprintDetails.sprintId,
          updateStatus: "UPDATESPRINTNAME",
        })
        .then((res) => {
          socket.emit("sprintCreated", {
            ProjectId: project.id,
            sprint: res.data,
            members,
            type: "updatesprint",
            section: "backlog",
            sprints,
          });
          cancelSprint();
          Toast.success("Sprint Updated!", {
            id: notification,
          });
        });
    } catch (error: any) {
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <>
      <div
        className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
          isSprintModalOpen ? "flex" : "hidden"
        } justify-center items-center `}
        id="overlay"
        //   onClick={() => setIsSprintModalOpen(!isOpen)}
      >
        <div className="bg-white w-[550px] h-auto py-6 px-4 rounded-md shadow-xl text-gray-800">
          <div className="flex">
            <span className="flex-grow w-full text-gray-700 text-md font-semibold">
              Create Sprint
            </span>

            <svg
              className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-full"
              id="close-modal"
              fill="currentColor"
              viewBox="0 0 20 20"
              onClick={() => cancelSprint()}
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="mt-3">
            <form
              onSubmit={
                updateSprintDetails.index !== -1
                  ? (e) => updateSprint(e)
                  : (e) => createSprint(e)
              }
            >
              <input
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                placeholder="Enter Sprint Name"
                className="w-[60%] p-2 rounded-md bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-blue-300 focus:bg-white text-gray-600 placeholder:text-gray-500"
              />

              {/* <div className="w-[60%]">
                <span>Duration</span>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div> */}
              <div className="flex items-center justify-between mt-5 w-[60%] space-x-1">
                <div className="w-full">
                  <DatePicker
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yy/MM/dd"
                  />
                </div>
                <div className="w-full">
                  <DatePicker
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    selected={startTime}
                    onChange={(date) => console.log(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeFormat="HH:mm"
                    dateFormat="h:mm aa"
                    timeCaption="Time"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 w-[60%] space-x-1">
                <div className="w-full">
                  <DatePicker
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yy/MM/dd"
                  />
                </div>
                <div className="w-full">
                  <DatePicker
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    selected={endTime}
                    onChange={(date) => setEndTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeFormat="HH:mm"
                    dateFormat="h:mm aa"
                    timeCaption="Time"
                  />
                </div>
              </div>

              {/* <DatePicker
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yy/MM/dd"
              />
              <DatePicker
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                selected={selectedTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
                timeFormat="HH:mm"
                dateFormat="yy/MM/dd"
              /> */}

              {/* <p>
                Selected Date and Time: {getCombinedDateTime().toISOString()}
              </p> */}

              <div className="flex space-x-3 justify-end items-center mt-2">
                <button
                  className="px-3 py-1 rounded   text-red-400 border border-red-300  hover:font-bold"
                  type="button"
                  onClick={() => cancelSprint()}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-green-500 text-white hover:bg-green-600 hover:text-white font-medium rounded"
                  type="submit"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SprintModal;

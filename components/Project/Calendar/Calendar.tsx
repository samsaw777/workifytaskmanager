import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { urlFetcher } from "../../../utils/Helper/urlFetcher";
import { ProjectState } from "../../../Context/ProjectContext";
import IssueInfoModal, { IssueLabels, Label } from "../../Modals/TaskModal";
import CalendarLoading from "../../Loading/CalendarLoaing";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    id: 1,
    title: "Event 1",
    start: new Date(2023, 2, 1, 10, 0),
    end: new Date(2023, 2, 1, 12, 0),
  },
  {
    id: 2,
    title: "Event 2",
    start: new Date(2023, 2, 2, 14, 0),
    end: new Date(2023, 2, 2, 16, 0),
  },
  {
    id: 3,
    title: "Event 3",
    start: new Date(2023, 2, 3, 9, 0),
    end: new Date(2023, 2, 3, 11, 0),
  },
];

const UserCalendar = () => {
  const [getItems, setGetItems] = useState<any>([]);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<IssueLabels[] | [] | Label[]>([]);
  const [issue, setIssue] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const {
    loggedInUser: { id },
    project,
  } = ProjectState();

  const getColor = (date: any, startDate: any) => {
    // Get the current date and convert both dates to UTC
    const currentDate = new Date().toISOString();
    const inputDate = new Date(date).toISOString();
    const StartDate = new Date(startDate).toISOString();
    if (inputDate < currentDate) {
      return "#ef4444";
    } else if (StartDate > currentDate) {
      return "#6b7280";
    }
    // Compare the dates and return the result
    return "#22c55e";
  };
  const getAllTheItems = async () => {
    console.log(project);
    setLoading(true);
    // if (project.id) {
    await axios
      .post(`${urlFetcher()}/api/dashboard/getassigneditems`, {
        userId: id,
        projectId: project.id,
      })
      .then((response) => {
        setLoading(false);
        let res: any = [];
        response?.data?.map((data: any, index: number) => {
          res.push({
            ...data,
            start: data.createdAt,
            end: data.endAt,
            color: getColor(data.endAt, data.createdAt),
          });
        });
        setGetItems(res);
      });
    // }
  };

  React.useEffect(() => {
    getAllTheItems();
  }, []);

  const handleEventClick = (event: any) => {
    setIssue(event);
    setIsIssueModalOpen(!isIssueModalOpen);
  };

  const eventPropGetter = (
    event: any,
    start: any,
    end: any,
    isSelected: any
  ) => {
    let style = {
      backgroundColor: event.color,
    };
    return {
      style: style,
    };
  };

  return (
    <div>
      :
      {loading ? (
        // <div className="w-full h-[70vh] flex items-center justify-center">
        //   <span>Loading ...</span>
        // </div>
        <CalendarLoading />
      ) : (
        <Calendar
          localizer={localizer}
          events={getItems}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventPropGetter}
          views={["month"]} // pass an empty array to disable all views
          // defaultView="month"
        />
      )}
      {isIssueModalOpen && (
        <IssueInfoModal
          isOpen={isIssueModalOpen}
          task={issue}
          sectionName={issue.sprintName}
          setIsOpen={setIsIssueModalOpen}
          setLabels={setLabels}
          labels={labels}
          type="scrum"
        />
      )}
    </div>
  );
};

export default UserCalendar;

import React, { useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import { ProjectState } from "../../Context/ProjectContext";
import DashboardTask from "./DashboardTask";

const Tasks = () => {
  const {
    loggedInUser: { id },
  } = ProjectState();
  const [assignedTasks, setAssignedTasks] = React.useState([]);
  console.log(assignedTasks);

  const fetchAssignedTask = async () => {
    await axios
      .post(`${urlFetcher()}/api/dashboard/getassigneditems`, {
        userId: id,
      })
      .then((response) => {
        setAssignedTasks(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchAssignedTask();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {assignedTasks.map((task: any, index: number) => {
        return <DashboardTask task={task} index={index} />;
      })}
    </div>
  );
};

export default Tasks;

/* 

Schema for report of a book.

id:Integer,
personName:String,
title:String,
author:String,
submittedDate:Date,
status: String,
ratings: Interger,
image:String,


*/

// https://workifytaskmanager.onrender.com/routes

/*

1. nodejs host -> url -> xyz.com
2. API xyz.com/books 


*/

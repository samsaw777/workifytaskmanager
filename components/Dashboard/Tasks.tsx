import React, { useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import { ProjectState } from "../../Context/ProjectContext";

const Tasks = () => {
  const {
    loggedInUser: { id },
  } = ProjectState();
  const [assignedTasks, setAssignedTasks] = React.useState([]);

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
    <div>
      {assignedTasks.map((task: any, index: number) => {
        return <div key={index}>{task.title}</div>;
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

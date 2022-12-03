import React, { useEffect, useState } from "react";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import axios from "axios";
import io from "socket.io-client";
import {
  Project,
  getProjects,
  createProject,
  updateProject,
} from "../../utils/apicalls/project";

interface Message {
  message: string;
}

let socket: any;

const Dashboard = () => {
  const [loggedinUser, setLoggedInUser] = useState({});

  const [projects, setProjects] = useState<Project[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message>({ message: "" });
  console.log(messages);
  const getUser = async () => {
    await axios
      .get(`${urlFetcher()}/api/user/getuser`)
      .then((res) => {
        setLoggedInUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket/socket");

    socket = io();

    socket.on("newIncomingMessage", (message: any) => {
      setMessages([...messages, message]);
    });

    console.log(messages);
  };

  useEffect(() => {
    getUser();
    getProjects(setProjects);
    socketInitializer();
  }, []);

  // const createProject = async () => {
  //   await axios
  //     .post(`${urlFetcher()}/api/project/createproject`, {
  //       name: "Second Project",
  //       userId: "83fbe910-0dbf-47c7-a101-d827d280b6ba",
  //       isPrivate: true,
  //     })
  //     .then((res) => console.log(res.data))
  //     .catch((error: any) => {
  //       console.log(error.response.data.error);
  //     });
  // };

  const sendMessaage = async (e: any) => {
    e.preventDefault();
    socket.emit("createdMessage", message);
    setMessages([...messages, message]);
    setMessage({ message: "" });
  };

  const body = {
    name: "Third Project",
    userId: "83fbe910-0dbf-47c7-a101-d827d280b6ba",
    isPrivate: true,
  };

  return (
    <div>
      This is dashboard view.
      <div
        className="p-2 bg-blue-300 rounded cursor-pointer w-fit"
        onClick={() => createProject(projects, body, setProjects)}
      >
        Create Project
      </div>
      <div>
        {projects.map((project: Project, index: number) => {
          return (
            <div key={index}>
              <div>{project.name}</div>
              <div
                className="p-2 w-fit bg-green-300 cursor-pointer"
                onClick={() =>
                  updateProject(
                    projects,
                    index,
                    { name: "last", isPrivate: true, id: project.id },
                    setProjects
                  )
                }
              >
                Update Project
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {messages.map((message: any, index: number) => {
          return <div key={index}>{message.message}</div>;
        })}
      </div>
      <div>
        <form onSubmit={(e) => sendMessaage(e)}>
          <input
            value={message.message}
            onChange={(e) => setMessage({ message: e.target.value })}
            type="text"
            placeholder="New message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;

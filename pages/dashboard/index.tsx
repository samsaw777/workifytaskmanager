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
import ProjectComponent from "../../components/Project/Project";

interface Message {
  message: string;
}

interface LoggedInUser {
  id: string;
  username: string;
  profile: string;
  email: string;
}

let socket: any;

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser>({
    id: "",
    username: "",
    profile: "",
    email: "",
  });
  const [projects, setProjects] = useState<Project[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  console.log(messages);
  const getUser = async () => {
    await axios
      .get(`${urlFetcher()}/api/user/getuser`)
      .then((res) => {
        setLoggedInUser({
          id: res.data.id,
          username: res.data.username,
          profile: res.data.profile,
          email: res.data.email,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const socketInitializer = async () => {
    getUser();
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (message: any) => {
      console.log(message);
      setMessages((currentmsg: any) => [...currentmsg, { message }]);
    });

    console.log(messages);
    getProjects(setProjects);
  };

  useEffect(() => {
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
    setMessages((currentmsg: any) => [...currentmsg, { message }]);
    setMessage("");
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
      <ProjectComponent
        loggedInUser={{ id: loggedInUser.id, username: loggedInUser.username }}
      />
      <div>
        {messages.map((message: any, index: number) => {
          return <div key={index}>{message.message}</div>;
        })}
      </div>
      <div>
        <form onSubmit={(e) => sendMessaage(e)}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

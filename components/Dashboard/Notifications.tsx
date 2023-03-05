import React from "react";
import { ProjectState } from "../../Context/ProjectContext";

const Notifications = () => {
  const { notifications, setNotifications } = ProjectState();

  return <div>This is the notifications component.</div>;
};

export default Notifications;

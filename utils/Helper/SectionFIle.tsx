import React, { useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "./urlFetcher";
import Toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { kanbanSectionHeader } from "../../components/Project/Kanban/KanbanSection";

interface Section {
  id: number;
  title: string;
  boardId: number;
}

export const deleteSection = async (
  sectionId: number,
  socket: Socket,
  ProjectId: number,
  members: any
) => {
  const notification = Toast.loading("Deleting Section!");
  try {
    await axios
      .post(`${urlFetcher()}/api/section/deletesection`, {
        id: sectionId,
      })
      .then((res) => {
        socket.emit("sectionCreated", {
          ProjectId,
          members,
          kanbansection: res.data,
          type: "deletesection",
          dashboardsection: "kanban",
        });
        Toast.success("Section Deleted!", { id: notification });
      });
  } catch (error: any) {
    Toast.error(error.message, { id: notification });
  }
};

export const updateSection = async (
  e: any,
  boardId: number,
  title: string,
  id: number,
  setSectionTitle: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  socket: Socket,
  ProjectId: number,
  members: any,
  sections: any
) => {
  e.preventDefault();
  try {
    setLoading(true);
    await axios
      .post(`${urlFetcher()}/api/section/updatesection`, {
        boardId,
        title,
        id,
      })
      .then((response) => {
        // setSectionTitle(response.data.title);

        setLoading(false);
        socket.emit("sectionCreated", {
          ProjectId,
          members,
          kanbansection: response.data,
          type: "updatesection",
          dashboardsection: "kanban",
          sections,
        });

        kanbanSectionHeader?.current?.blur();
      });
  } catch (error: any) {
    console.log(error.message);
    setLoading(false);
  }
};

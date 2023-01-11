import React, { useState, useEffect } from "react";
import { Label } from "../../../Modals/TaskModal";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import axios from "axios";
import Toast from "react-hot-toast";
import TaskLabel from "./Label";
import { Task } from "../../../Modals/TaskModal";
import { ProjectState } from "../../../../Context/ProjectContext";
import { io, Socket } from "socket.io-client";
let socket: Socket;

interface Props {
  task: Task;
  taskId: number;
  setLabels: React.Dispatch<React.SetStateAction<[] | Label[]>>;
  labels: Label[] | [];
}

const TaskLabels: React.FunctionComponent<Props> = ({
  taskId,
  task,
  setLabels,
  labels,
}: Props) => {
  const socketInit = async () => {
    // await fetch(`${urlFetcher()}/api/socket`);

    socket = io();
  };

  useEffect(() => {
    socketInit();
  }, []);
  const {
    sections,
    setSections,
    project: { id: ProjectId },
    members,
  } = ProjectState();

  const [showLabelInput, setShowLabelInput] = useState<boolean>(false);
  const [labelValue, setLabelValue] = useState<string>("");

  const createTaskLabel = async (e: any) => {
    e.preventDefault();
    const notification = Toast.loading("Creating Task");
    try {
      await axios
        .post(`${urlFetcher()}/api/kanban/task/createlabel`, {
          taskId,
          label: labelValue,
        })
        .then((res) => {
          Toast.success("Label Created!", { id: notification });

          socket.emit("labelCreated", {
            ProjectId,
            members,
            label: res.data,
            task,
            type: "createTask",
            section: "kanban",
            sections,
          });

          setLabelValue("");
          // task.labels = [...task.labels, res.data];
          setShowLabelInput(!showLabelInput);
        });
    } catch (error: any) {
      Toast.error(error.message, { id: notification });
    }
  };

  const deleteTaskLabel = async (labelId: number) => {
    setShowLabelInput(!showLabelInput);
    const notification = Toast.loading("Deleting Task");
    try {
      await axios
        .post(`${urlFetcher()}/api/kanban/task/deletelabel`, {
          labelId,
        })
        .then((res) => {
          Toast.success("Label Deleted!", { id: notification });
          socket.emit("labelCreated", {
            ProjectId,
            members,
            label: res.data,
            task,
            type: "deleteTask",
            section: "kanban",
            sections,
          });
        });
    } catch (error: any) {
      Toast.error(error.message, { id: notification });
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div className="text-sm text-gray-500 font-medium">Labels</div>
      <div className="text-sm text-black font-normal">
        {task?.labels?.length > 0 ? (
          <div
            className="flex p-1 bg-gray-200 rounded-sm mb-1 items-center flex-wrap gap-2"
            onClick={() => setShowLabelInput(!showLabelInput)}
          >
            {task?.labels?.map((label: Label, index: number) => (
              <div key={index}>
                <TaskLabel
                  id={label.id}
                  name={label.name}
                  index={index}
                  isInsideModal={true}
                  showLabelInput={showLabelInput}
                  deleteTaskLabel={deleteTaskLabel}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="bg-gray-200 rounded p-2 cursor-pointer text-gray-500"
            onClick={() => setShowLabelInput(true)}
          >
            None
          </div>
        )}
        {showLabelInput && (
          <form onSubmit={(e) => createTaskLabel(e)} className="mt-2">
            <input
              className="border-2 border-gray-200 rounded p-1 w-full"
              placeholder="Add Tags"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
            />
            <button type="submit" className="hidden"></button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TaskLabels;

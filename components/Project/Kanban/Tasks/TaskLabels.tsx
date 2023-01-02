import React, { useState } from "react";
import { Label } from "../../../Modals/TaskModal";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import axios from "axios";
import Toast from "react-hot-toast";

interface Props {
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  taskId: number;
}

const TaskLabels: React.FunctionComponent<Props> = ({
  labels,
  taskId,
  setLabels,
}: Props) => {
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
          setLabelValue("");
          setLabels([...labels, res.data]);
        });
    } catch (error: any) {
      Toast.error(error.message, { id: notification });
    }
  };

  const deleteTaskLabel = async (labelId: number) => {
    const notification = Toast.loading("Deleting Task");
    try {
      await axios
        .post(`${urlFetcher()}/api/kanban/task/deletelabel`, {
          labelId,
        })
        .then((res) => {
          Toast.success("Label Deleted!", { id: notification });
          setLabels(labels.filter((label: Label) => label.id !== res.data.id));
        });
    } catch (error: any) {
      Toast.error(error.message, { id: notification });
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div className="text-sm text-gray-500 font-medium">Labels</div>
      <div className="text-sm text-black font-normal">
        {labels?.length > 0 ? (
          <div
            className="flex p-1 bg-gray-200 rounded-sm mb-1 items-center flex-wrap gap-2"
            onClick={() => setShowLabelInput(!showLabelInput)}
          >
            {labels?.map((label: Label, index: number) => (
              <div key={index} className="flex">
                <div className="bg-white px-2 text-sm text-gray-600 font-mediun ">
                  {label.name}
                </div>
                {showLabelInput && (
                  <div
                    className="text-xs bg-red-400  px-1 cursor-pointer"
                    onClick={() => deleteTaskLabel(label.id)}
                  >
                    X
                  </div>
                )}
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

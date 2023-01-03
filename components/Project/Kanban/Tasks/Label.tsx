import React from "react";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import axios from "axios";
import Toast from "react-hot-toast";
import { Label } from "../../../Modals/TaskModal";

interface Props {
  name: string;
  index: number;
  id: number;
  showLabelInput?: boolean;
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  isInsideModal: boolean;
}

const Label: React.FunctionComponent<Props> = ({
  index,
  name,
  id,
  showLabelInput,
  labels,
  setLabels,
  isInsideModal,
}: Props) => {
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
    <div key={index} className="flex">
      <div
        className={`${
          isInsideModal ? "bg-white" : "bg-gray-100"
        } px-2 py-1 text-sm text-gray-600 font-mediun rounded-md`}
      >
        {name}
      </div>
      {showLabelInput && isInsideModal && (
        <div
          className="text-xs bg-red-400  px-1 cursor-pointer"
          onClick={() => deleteTaskLabel(id)}
        >
          X
        </div>
      )}
    </div>
  );
};

export default Label;

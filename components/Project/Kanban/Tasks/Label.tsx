import React from "react";
import { urlFetcher } from "../../../../utils/Helper/urlFetcher";
import axios from "axios";
import Toast from "react-hot-toast";
import { Task } from "../../../Modals/TaskModal";

interface Props {
  name: string;
  index: number;
  id: number;
  showLabelInput?: boolean;
  isInsideModal: boolean;
  deleteTaskLabel: (labelId: number) => Promise<void>;
}

const Label: React.FunctionComponent<Props> = ({
  index,
  name,
  id,
  showLabelInput,
  isInsideModal,
  deleteTaskLabel,
}: Props) => {
  return (
    <div key={index} className="flex items-center">
      <div
        className={`${
          isInsideModal ? "bg-white" : "bg-gray-100"
        } px-2 py-1 text-sm text-gray-600 font-mediun rounded-md`}
      >
        {name}
      </div>
      {!showLabelInput && isInsideModal && (
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

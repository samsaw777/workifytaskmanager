import React from "react";
import { colorFetcher } from "../../../../utils/Helper/colorFetcher";
import { Draggable } from "react-beautiful-dnd";

interface Props {
  issue: string;
  id: number;
  type: string;
  index: number;
}

const SectionIssue = ({ issue, id, type, index }: Props) => {
  return (
    <Draggable key={id.toString()} draggableId={id.toString()} index={index}>
      {(provided) => (
        <div
          className="p-2 rounded-md bg-white flex flex-col space-y-4 cursor-pointer"
          key={id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="text-md">{issue}</div>

          <div className="flex space-x-2 items-center">
            <span
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: `${colorFetcher(type)}`,
              }}
            ></span>
            <span className="text-xs font-extralight text-gray-800">
              NEW-{id}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default SectionIssue;

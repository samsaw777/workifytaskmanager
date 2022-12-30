import React, { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

interface Item {
  id: number;
  title: string;
  color: string;
}

type UpdateIssue = {
  type: string;
  id: number;
  issue: string;
  sprintId: number;
};

interface Props {
  menuItems: Item[];
  setSelectedItem: React.Dispatch<React.SetStateAction<Item>>;
  selectedItem: Item;
  updateIssueDetails: UpdateIssue;
  isOpenModal: boolean;
}

const Dropdown = ({
  menuItems,
  setSelectedItem,
  selectedItem,
  updateIssueDetails,
  isOpenModal,
}: Props) => {
  React.useEffect(() => {
    setItems(menuItems.filter((item) => item.title != updateIssueDetails.type));
  }, [isOpenModal]);

  const [items, setItems] = useState<Item[]>(
    menuItems.filter((item) => item.title !== updateIssueDetails.type)
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDropDownSelect = (item: {
    id: number;
    title: string;
    color: string;
  }) => {
    let newItems = JSON.parse(JSON.stringify(menuItems));

    setSelectedItem(item);
    setItems(newItems.filter((currentItem: Item) => currentItem.id != item.id));
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full relative">
      <div
        className="flex justify-between px-2 py-1 border-2 border-gray-200 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="flex space-x-2 items-center
        "
        >
          <div
            className={`w-3 h-3  rounded-sm `}
            style={{ backgroundColor: `${selectedItem?.color}` }}
          ></div>
          <span className="text-sm font-normal">{selectedItem?.title}</span>
        </div>
        <MdArrowDropDown
          className={`text-2xl  ${
            isOpen && "rotate-180"
          } transition duration-150`}
        />
      </div>
      {isOpen && (
        <ul className="w-full bg-gray-100 mt-1 transition ease-in-out absolute z-10">
          {items.map((item: Item, index: number) => {
            return (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-300"
                onClick={() => handleDropDownSelect(item)}
              >
                <div className="flex space-x-4 items-center">
                  <div
                    className={`w-3 h-3  rounded-sm `}
                    style={{ backgroundColor: `${item?.color}` }}
                  ></div>
                  <div>{item.title}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

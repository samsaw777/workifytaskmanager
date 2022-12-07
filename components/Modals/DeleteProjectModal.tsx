import React from "react";
import { Project, deleteProject } from "../../utils/apicalls/project";
import toast from "react-hot-toast";
import { FcDeleteRow } from "react-icons/fc";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  name: string;
  projectId: number;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projects: Project[];
}

const DeleteProjectModal = ({
  isOpen,
  setIsOpen,
  projectId,
  name,
  title,
  setProjects,
  projects,
}: Props) => {
  const deleteUserProject = async (e: any) => {
    e.preventDefault();
    const notification = toast.loading("Deleting Project!");
    try {
      await deleteProject(projects, projectId, setProjects);
      setIsOpen(!isOpen);

      toast.success("Project Deleted!", {
        id: notification,
      });
    } catch (error: any) {
      toast.error(error.message, {
        id: notification,
      });
    }
  };

  return (
    <div
      className={`bg-gray-700 bg-opacity-50 absolute inset-0 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center `}
    >
      <div className="bg-white w-[550px] h-[400px] py-4 px-5 rounded-md flex flex-col  shadow-xl text-gray-800">
        <svg
          className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-md"
          id="close-modal"
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
        <FcDeleteRow className="w-20 h-20 xl:w-32 xl:h-32 block mx-auto mt-5" />
        <div className="w-full text-center text-lg font-bold text-gray-900 mt-5">
          Are you sure you want to delete {title} ?
        </div>
        <div className="text-center text-gray-500 font-medium text-md mt-5">
          After deleting <span className="font-bold text-gray-900">{name}</span>
          , all your progress will also be deleted.
        </div>
        <div className="w-full mt-10">
          <form
            className="w-full flex justify-end space-x-2"
            onSubmit={(e) => deleteUserProject(e)}
          >
            <button
              className="px-3 py-1 rounded   text-gray-400 border border-gray-300 hover:border-gray-800 hover:font-bold"
              onClick={() => setIsOpen(!isOpen)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 hover:text-white font-medium rounded"
              type="submit"
            >
              Delete {title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;

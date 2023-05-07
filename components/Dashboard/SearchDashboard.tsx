import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlFetcher } from "../../utils/Helper/urlFetcher";
import { ProjectState } from "../../Context/ProjectContext";
import Toast from "react-hot-toast";

interface Project {
  id: number;
  name: string;
  userEmail: string;
}

const Search = () => {
  const {
    loggedInUser: { id, username, profile },
  } = ProjectState();

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchedProjects, setSearchedProject] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(searchedProjects);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue) {
        setLoading(true);
        axios
          .post(`${urlFetcher()}/api/project/searchproject`, {
            projectName: searchValue,
          })
          .then((response) => {
            setSearchedProject(response.data);
            console.log(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      } else {
        setLoading(false);
        setSearchedProject([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const joinProject = async (projectId: number) => {
    const notification = Toast.loading("Joining Project");

    try {
      const response = await axios.post(
        `${urlFetcher()}/api/project/joinproject`,
        {
          projectId,
          userId: id,
          userName: username,
          userProfile: profile,
        }
      );
      console.log(response);
      if (typeof response.data != "string") {
        Toast.success("Joined Project", {
          id: notification,
        });
      } else {
        Toast.error(response.data, { id: notification });
      }
    } catch (error: any) {
      console.log(error.message);
      Toast.error(error.message, {
        id: notification,
      });
    }
  };

  /*
    onSubmit={(e) => serachUserProjects(e)}
    */
  return (
    <div>
      <div className="w-[300px]">
        <form>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Search Project Name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit" className="hidden"></button>
          </div>
        </form>
        {searchedProjects.length > 0 && (
          <div className="absolute top-20 z-10 w-[600px] bg-gray-100 rounded-md max-h-[500px] overflow-y-scroll p-2">
            {searchedProjects?.map((project: Project, index: number) => {
              return (
                <div
                  key={index}
                  className=" mt-2  p-2 bg-white flex justify-between items-center"
                >
                  <div>
                    <div className="text-lg font-bold">{project.name}</div>
                    <div className="text-xs">{project.userEmail}</div>
                  </div>
                  <button
                    onClick={() => joinProject(project.id)}
                    className="w-fit py-1 px-2 bg-green-300 text-center text-black font-medium rounded-md cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {/* {loading && (
          <div className="absolute text-center top-20 z-10 w-[600px] bg-white rounded-md  p-2">
            Loading ...
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Search;

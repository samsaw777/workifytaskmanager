import React from "react";
import axios from "axios";
import { urlFetcher } from "./urlFetcher";
import Toast from "react-hot-toast";

interface Section {
  id: number;
  title: string;
  boardId: number;
}

export const deleteSection = async (
  sectionId: number,
  setSections: React.Dispatch<React.SetStateAction<Section[]>>,
  sections: Section[]
) => {
  const notification = Toast.loading("Deleting Section!");
  try {
    await axios
      .post(`${urlFetcher()}/api/section/deletesection`, {
        id: sectionId,
      })
      .then((res) => {
        const newData = sections.filter(
          (section: any) => section.id != sectionId
        );
        setSections(newData);
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
  setSections: React.Dispatch<React.SetStateAction<Section[]>>,
  sections: Section[]
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
        setSectionTitle(response.data.title);
        setLoading(false);
        let newData: any = JSON.parse(JSON.stringify(sections));

        const index = newData.findIndex((e: any) => e.id === response.data.id);

        newData[index].title = response.data.title;

        setSections(newData);
      });
  } catch (error: any) {
    console.log(error.message);
    setLoading(false);
  }
};

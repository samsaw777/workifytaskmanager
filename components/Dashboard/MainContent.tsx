import React from "react";
import { showComponent } from "../../utils/Helper/MainContext";

type Props = {
  componentName: string;
};

const MainContent = ({ componentName }: Props) => {
  return (
    <div className="h-[90vh] overflow-scroll p-5">
      {showComponent({ componentName })}
    </div>
  );
};

export default MainContent;

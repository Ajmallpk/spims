import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | SPIMS`;
  }, [title]);

  return null;
};

export default PageTitle;
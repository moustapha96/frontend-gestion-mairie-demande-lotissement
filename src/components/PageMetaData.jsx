import { Helmet } from "react-helmet-async";

const PageMetaData = ({ title }) => {
  return (
    <Helmet>
      <title>
        {title} | La Mairie
      </title>
    </Helmet>
  );
};

export default PageMetaData;

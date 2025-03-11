import { Helmet } from "react-helmet-async";

const PageMetaData = ({ title = "Mairie" }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | La Mairie` : "La Mairie"}</title>
    </Helmet>
  );
};

export default PageMetaData;

import { PageMetaData, TopNavBar } from "@/components";
import AboutUs from "./components/About";
import { useAuthContext } from "../../../context/useAuthContext";
import { useEffect } from "react";
import { menuItems } from "@/assets/data";


const Dashboard = () => {
  const { session, isAuthenticated } = useAuthContext();

  useEffect(() => {
    console.log(session, isAuthenticated);
  }, [session, isAuthenticated]);

  return (
    <>
      <PageMetaData title="Dashboard CCBME" />

      <TopNavBar
        menuItems={menuItems}
        hasDownloadButton
        position="fixed"
      />

      <AboutUs />
      {/* <Hero />
      <AboutUs />

      <Services />
      <Pricing />
      <Contact />
      <FAQs /> */}
    </>
  );
};

export default Dashboard;
import { PageMetaData, TopNavBar } from "@/components";
import AboutUs from "./components/About";
import { useAuthContext } from "../../../context/useAuthContext";
import { useEffect } from "react";


const Dashboard = () => {
  const { session, isAuthenticated } = useAuthContext();

  useEffect(() => {
    console.log(session, isAuthenticated);
  }, [session, isAuthenticated]);

  return (
    <>
      <PageMetaData title="Dashboard CCBME" />
      <TopNavBar
        menuItems={["Accueil"]}
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
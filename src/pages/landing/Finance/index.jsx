import { PageMetaData, TopNavBar } from "@/components"
import Hero from "./components/Hero"
import MarqueeGroup from "./components/MarqueeGroup"
import Experts from "./components/Experts"
import Feature1 from "./components/Feature1"
import Feature2 from "./components/Feature2"
import Feature3 from "./components/Feature3"
import ValuableAssets from "./components/ValuableAssets"
import OnBoarding from "./components/OnBoarding"
import SearchPlan from "./components/SearchPlan"

const Finance = () => {
  return (
    <>
      <PageMetaData title="Gestion de la Mairie" />

      <TopNavBar menuItems={["accueil", "services", "ressources", "nouvelle-demande"]} position="fixed" />

      <Hero />

      {/* <MarqueeGroup /> */}

      {/* <Experts /> */}

      <Feature1 />

      <Feature2 />

      <Feature3 />

      <ValuableAssets />

      {/* <OnBoarding /> */}

      <SearchPlan />
    </>

  )
}

export default Finance